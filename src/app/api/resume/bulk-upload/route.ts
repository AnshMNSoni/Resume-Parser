export const runtime = 'nodejs';
export const maxDuration = 300;

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parsePDF } from '@/lib/services/pdf-parser';
import { extractPDFsFromZip } from '@/lib/services/zip-extractor';
import { extractResumeData } from '@/lib/services/data-extractor';
import { scoreResumeWithGemini } from '@/lib/services/gemini-scorer';

async function processResume(buffer: Buffer, fileName: string, batchId: string) {
  try {
    const parsed = await parsePDF(buffer);
    const resumeData = extractResumeData(parsed.text);
    const scores = await scoreResumeWithGemini(parsed.text);

    const allSkills = [...resumeData.skills];
    const existingSkillNames = new Set(allSkills.map((s) => s.name.toLowerCase()));
    for (const skill of scores.extractedSkills) {
      if (!existingSkillNames.has(skill.name.toLowerCase())) {
        allSkills.push(skill);
        existingSkillNames.add(skill.name.toLowerCase());
      }
    }

    await prisma.candidate.create({
      data: {
        name: resumeData.contact.name,
        email: resumeData.contact.email,
        phone: resumeData.contact.phone,
        linkedinUrl: resumeData.contact.linkedinUrl,
        githubUrl: resumeData.contact.githubUrl,
        portfolioUrl: resumeData.contact.portfolioUrl,
        rawText: parsed.text,
        fileName,
        batchId,
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
    });

    return { success: true, fileName };
  } catch (error) {
    console.error(`Failed to process ${fileName}:`, error);
    return {
      success: false,
      fileName,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const zipFile = formData.get('zip') as File | null;
    const batchName = (formData.get('batchName') as string) || 'Untitled Batch';

    // Guard: total upload size limit (50MB matches serverActions.bodySizeLimit)
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024;
    let totalSize = 0;

    if (zipFile) totalSize += zipFile.size;
    for (const file of files) totalSize += file.size;

    if (totalSize > MAX_TOTAL_SIZE) {
      return Response.json(
        {
          error: `Total upload size (${(totalSize / 1024 / 1024).toFixed(1)}MB) exceeds 50MB limit`,
        },
        { status: 413 }
      );
    }

    const pdfBuffers: { fileName: string; buffer: Buffer }[] = [];

    // Handle ZIP file
    if (zipFile) {
      if (!zipFile.name.toLowerCase().endsWith('.zip')) {
        return Response.json({ error: 'Invalid ZIP file' }, { status: 400 });
      }
      const zipBuffer = Buffer.from(await zipFile.arrayBuffer());
      const extracted = extractPDFsFromZip(zipBuffer);
      pdfBuffers.push(...extracted);
    }

    // Handle individual PDF files
    for (const file of files) {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const buffer = Buffer.from(await file.arrayBuffer());
        pdfBuffers.push({ fileName: file.name, buffer });
      }
    }

    if (pdfBuffers.length === 0) {
      return Response.json({ error: 'No PDF files to process' }, { status: 400 });
    }

    // Create batch record
    const batch = await prisma.batchUpload.create({
      data: {
        name: batchName,
        totalResumes: pdfBuffers.length,
        processedCount: 0,
        status: 'processing',
      },
    });

    // Process all resumes (in parallel with concurrency limit)
    const CONCURRENCY = 3;
    const results: { success: boolean; fileName: string; error?: string }[] = [];
    let processedCount = 0;

    for (let i = 0; i < pdfBuffers.length; i += CONCURRENCY) {
      const chunk = pdfBuffers.slice(i, i + CONCURRENCY);
      const chunkResults = await Promise.allSettled(
        chunk.map((pdf) => processResume(pdf.buffer, pdf.fileName, batch.id))
      );

      for (const result of chunkResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
          if (result.value.success) processedCount++;
        } else {
          results.push({
            success: false,
            fileName: 'unknown',
            error: 'Processing failed',
          });
        }
      }

      // Update progress
      await prisma.batchUpload.update({
        where: { id: batch.id },
        data: { processedCount },
      });
    }

    // Mark batch as completed
    await prisma.batchUpload.update({
      where: { id: batch.id },
      data: {
        status:
          processedCount === pdfBuffers.length
            ? 'completed'
            : 'completed_with_errors',
        processedCount,
      },
    });

    return Response.json(
      {
        success: true,
        batchId: batch.id,
        total: pdfBuffers.length,
        processed: processedCount,
        failed: pdfBuffers.length - processedCount,
        results,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Bulk upload error:', error);

    if (error instanceof Error) {
      if (
        error.message.includes('DATABASE_URL') ||
        error.message.includes('GEMINI_API_KEY')
      ) {
        return Response.json(
          { error: 'Server configuration error. Please contact the administrator.' },
          { status: 503 }
        );
      }
    }

    const message =
      error instanceof Error ? error.message : 'Failed to process resumes';
    return Response.json({ error: message }, { status: 500 });
  }
}
