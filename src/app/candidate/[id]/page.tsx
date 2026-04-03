import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { SkillTag } from '@/components/ui/SkillTag';
import { ChevronLeft, Mail, Phone, Globe, LinkIcon, ChevronRight } from 'lucide-react';

async function getCandidate(id: string) {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        score: true,
        skills: true,
        experiences: true,
        educations: true,
      },
    });
    return candidate;
  } catch {
    return null;
  }
}

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getCandidate(id);

  if (!candidate) {
    notFound();
  }

  const score = candidate.score;

  return (
    <div className="space-y-8">
      <Link
        href="/candidates"
        className="inline-flex items-center gap-2 text-xs font-medium text-dark-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
        Back to candidates
      </Link>

      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {candidate.name || 'Unknown Candidate'}
            </h1>
            <p className="text-sm text-dark-400">{candidate.fileName}</p>
            {(candidate.targetRole || candidate.requiredSkills) && (
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                {candidate.targetRole && (
                  <span className="px-2 py-1 rounded bg-white/5 text-dark-200 border border-white/10 font-medium">
                    Target Role: <span className="text-white">{candidate.targetRole}</span>
                  </span>
                )}
                {candidate.requiredSkills && (
                  <span className="px-2 py-1 rounded bg-white/5 text-dark-200 border border-white/10 font-medium max-w-[300px] truncate">
                    Skills: <span className="text-white">{candidate.requiredSkills}</span>
                  </span>
                )}
              </div>
            )}
          </div>
          {score && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Overall Fit</span>
              <span
                className={`text-3xl font-bold ${
                  score.overallJobFit >= 80
                    ? 'score-excellent'
                    : score.overallJobFit >= 65
                    ? 'score-good'
                    : score.overallJobFit >= 50
                    ? 'score-average'
                    : 'score-poor'
                }`}
                style={{ fontFamily: 'var(--font-mono, monospace)' }}
              >
                {score.overallJobFit}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-6 animate-slide-up">
        <h2 className="text-sm font-semibold text-white mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Email', value: candidate.email, icon: <Mail className="w-5 h-5 text-dark-400" />, href: candidate.email ? `mailto:${candidate.email}` : undefined },
            { label: 'Phone', value: candidate.phone, icon: <Phone className="w-5 h-5 text-dark-400" />, href: candidate.phone ? `tel:${candidate.phone}` : undefined },
            { label: 'LinkedIn', value: candidate.linkedinUrl, icon: <svg className="w-5 h-5 text-dark-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, href: candidate.linkedinUrl || undefined },
            { label: 'GitHub', value: candidate.githubUrl, icon: <svg className="w-5 h-5 text-dark-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>, href: candidate.githubUrl || undefined },
            { label: 'Portfolio', value: candidate.portfolioUrl, icon: <Globe className="w-5 h-5 text-dark-400" />, href: candidate.portfolioUrl || undefined },
            ...((candidate as any).externalLinks || []).map((link: string, idx: number) => ({
              label: `Link ${idx + 1}`,
              value: link,
              icon: <LinkIcon className="w-5 h-5 text-dark-400" />,
              href: link,
            })),
          ]
            .filter((item) => item.value)
            .map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900 border border-white/[0.03]">
                {item.icon}
                <div className="min-w-0">
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider font-semibold">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-emerald hover:text-accent-teal truncate block transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-xs text-dark-200 truncate">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          {!candidate.email && !candidate.phone && !candidate.linkedinUrl && !candidate.githubUrl && ((candidate as any).externalLinks || []).length === 0 && (
            <p className="text-xs text-dark-500 col-span-full">No contact information extracted</p>
          )}
        </div>
      </div>

      {/* Score Gauges */}
      {score && (
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-sm font-semibold text-white mb-5">AI Skill Assessment</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-5 flex justify-center">
              <ScoreGauge score={score.technicalSkills} label="Technical Skills" delay={0} />
            </div>
            <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-5 flex justify-center">
              <ScoreGauge score={score.codingSkills} label="Coding / DSA" delay={150} />
            </div>
            <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-5 flex justify-center">
              <ScoreGauge score={score.softSkills} label="Soft Skills" delay={300} />
            </div>
            <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-5 flex justify-center">
              <ScoreGauge score={score.overallJobFit} label="Overall Job Fit" delay={450} />
            </div>
          </div>
        </div>
      )}

      {/* AI Feedback */}
      {score && (
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-sm font-semibold text-white mb-4">AI Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Technical Skills', feedback: score.technicalFeedback },
              { title: 'Coding / DSA', feedback: score.codingFeedback },
              { title: 'Soft Skills', feedback: score.softSkillsFeedback },
              { title: 'Overall Assessment', feedback: score.overallFeedback },
            ].map((item) => (
              <div key={item.title} className="bg-dark-800/80 border border-white/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent-emerald" />
                  <h3 className="text-xs font-semibold text-dark-200 uppercase tracking-wider">{item.title}</h3>
                </div>
                <p className="text-sm text-dark-300 leading-relaxed">{item.feedback || 'No feedback available'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {candidate.skills.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Skills</h2>
          <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-6">
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <SkillTag key={skill.id} name={skill.name} category={skill.category} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Experience */}
      {candidate.experiences.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Experience</h2>
          <div className="space-y-3">
            {candidate.experiences.map((exp) => (
              <div key={exp.id} className="bg-dark-800/80 border border-white/5 rounded-xl p-5 relative">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-accent-emerald opacity-50" />
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2 pl-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{exp.title || 'Position'}</h3>
                    {exp.company && <p className="text-xs text-accent-teal">{exp.company}</p>}
                  </div>
                  {exp.duration && (
                    <span className="text-[11px] text-dark-400 font-mono bg-dark-900 border border-white/5 px-2 py-0.5 rounded">{exp.duration}</span>
                  )}
                </div>
                {exp.description && (
                  <p className="text-xs text-dark-400 leading-relaxed pl-2 whitespace-pre-line">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {candidate.educations.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Education</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {candidate.educations.map((edu) => (
              <div key={edu.id} className="bg-dark-800/80 border border-white/5 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-0.5">{edu.degree || 'Degree'}</h3>
                {edu.institution && <p className="text-xs text-dark-300">{edu.institution}</p>}
                {edu.year && <p className="text-xs text-dark-500 mt-1 font-mono">{edu.year}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Resume Text */}
      {candidate.rawText && (
        <details className="animate-slide-up group" style={{ animationDelay: '600ms' }}>
          <summary className="cursor-pointer text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4 flex items-center gap-2 hover:text-dark-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-dark-400 transition-transform group-open:rotate-90" strokeWidth={2} />
            Raw Resume Text
          </summary>
          <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-6 max-h-96 overflow-y-auto">
            <pre className="text-xs text-dark-400 whitespace-pre-wrap font-mono leading-relaxed">
              {candidate.rawText}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
}
