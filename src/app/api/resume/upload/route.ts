import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parsePDF } from '@/lib/services/pdf-parser';
import { extractResumeData } from '@/lib/services/data-extractor';
import { scoreResumeWithGemini } from '@/lib/services/gemini-scorer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return Response.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Parse PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parsePDF(buffer);

    // Extract structured data
    const resumeData = extractResumeData(parsed.text);

    // Score with Gemini
    const scores = await scoreResumeWithGemini(parsed.text);

    // Merge AI-extracted skills with regex-extracted skills
    const allSkills = [...resumeData.skills];
    const existingSkillNames = new Set(allSkills.map((s) => s.name.toLowerCase()));
    for (const skill of scores.extractedSkills) {
      if (!existingSkillNames.has(skill.name.toLowerCase())) {
        allSkills.push(skill);
        existingSkillNames.add(skill.name.toLowerCase());
      }
    }

    // Save to database
    const candidate = await prisma.candidate.create({
      data: {
        name: resumeData.contact.name,
        email: resumeData.contact.email,
        phone: resumeData.contact.phone,
        linkedinUrl: resumeData.contact.linkedinUrl,
        githubUrl: resumeData.contact.githubUrl,
        portfolioUrl: resumeData.contact.portfolioUrl,
        rawText: parsed.text,
        fileName: file.name,
        score: {
          create: {
            technicalSkills: scores.technicalSkills,
            codingSkills: scores.codingSkills,
            softSkills: scores.softSkills,
            overallJobFit: scores.overallJobFit,
            technicalFeedback: scores.technicalFeedback,
            codingFeedback: scores.codingFeedback,
            softSkillsFeedback: scores.softSkillsFeedback,
            overallFeedback: scores.overallFeedback,
          },
        },
        skills: {
          create: allSkills.map((s) => ({
            name: s.name,
            category: s.category,
          })),
        },
        experiences: {
          create: resumeData.experiences.map((e) => ({
            title: e.title,
            company: e.company,
            duration: e.duration,
            description: e.description,
          })),
        },
        educations: {
          create: resumeData.educations.map((e) => ({
            degree: e.degree,
            institution: e.institution,
            year: e.year,
          })),
        },
      },
      include: {
        score: true,
        skills: true,
        experiences: true,
        educations: true,
      },
    });

    return Response.json({ success: true, candidate }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process resume';
    return Response.json({ error: message }, { status: 500 });
  }
}
