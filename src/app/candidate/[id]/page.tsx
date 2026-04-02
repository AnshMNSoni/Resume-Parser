import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { SkillTag } from '@/components/ui/SkillTag';

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
      {/* Back */}
      <Link
        href="/candidates"
        className="inline-flex items-center gap-2 text-xs font-medium text-dark-400 hover:text-dark-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
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
      <div className="gradient-card rounded-2xl p-6 animate-slide-up">
        <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Email', value: candidate.email, icon: '✉️', href: candidate.email ? `mailto:${candidate.email}` : undefined },
            { label: 'Phone', value: candidate.phone, icon: '📱', href: candidate.phone ? `tel:${candidate.phone}` : undefined },
            { label: 'LinkedIn', value: candidate.linkedinUrl, icon: '💼', href: candidate.linkedinUrl || undefined },
            { label: 'GitHub', value: candidate.githubUrl, icon: '🐙', href: candidate.githubUrl || undefined },
            { label: 'Portfolio', value: candidate.portfolioUrl, icon: '🌐', href: candidate.portfolioUrl || undefined },
          ]
            .filter((item) => item.value)
            .map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/30 border border-white/[0.03]">
                <span className="text-lg">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider font-semibold">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-blue hover:text-accent-cyan truncate block transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-xs text-dark-200 truncate">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          {!candidate.email && !candidate.phone && !candidate.linkedinUrl && !candidate.githubUrl && (
            <p className="text-xs text-dark-500 col-span-full">No contact information extracted</p>
          )}
        </div>
      </div>

      {/* Score Gauges */}
      {score && (
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-5">AI Skill Assessment</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="gradient-card rounded-2xl p-5 flex justify-center">
              <ScoreGauge score={score.technicalSkills} label="Technical Skills" delay={0} />
            </div>
            <div className="gradient-card rounded-2xl p-5 flex justify-center">
              <ScoreGauge score={score.codingSkills} label="Coding / DSA" delay={150} />
            </div>
            <div className="gradient-card rounded-2xl p-5 flex justify-center">
              <ScoreGauge score={score.softSkills} label="Soft Skills" delay={300} />
            </div>
            <div className="gradient-card rounded-2xl p-5 flex justify-center">
              <ScoreGauge score={score.overallJobFit} label="Overall Job Fit" delay={450} />
            </div>
          </div>
        </div>
      )}

      {/* AI Feedback */}
      {score && (
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">AI Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Technical Skills', feedback: score.technicalFeedback, color: 'blue' },
              { title: 'Coding / DSA', feedback: score.codingFeedback, color: 'purple' },
              { title: 'Soft Skills', feedback: score.softSkillsFeedback, color: 'emerald' },
              { title: 'Overall Assessment', feedback: score.overallFeedback, color: 'amber' },
            ].map((item) => (
              <div key={item.title} className="gradient-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full bg-accent-${item.color}`} />
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
          <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">Skills</h2>
          <div className="gradient-card rounded-2xl p-6">
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
          <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">Experience</h2>
          <div className="space-y-3">
            {candidate.experiences.map((exp) => (
              <div key={exp.id} className="gradient-card rounded-xl p-5 relative">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-gradient-to-b from-accent-blue to-accent-purple" />
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2 pl-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{exp.title || 'Position'}</h3>
                    {exp.company && <p className="text-xs text-accent-blue">{exp.company}</p>}
                  </div>
                  {exp.duration && (
                    <span className="text-[11px] text-dark-400 font-mono bg-dark-800/50 px-2 py-0.5 rounded">{exp.duration}</span>
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
          <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">Education</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {candidate.educations.map((edu) => (
              <div key={edu.id} className="gradient-card rounded-xl p-5">
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
            <svg className="w-4 h-4 text-dark-400 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Raw Resume Text
          </summary>
          <div className="gradient-card rounded-2xl p-6 max-h-96 overflow-y-auto">
            <pre className="text-xs text-dark-400 whitespace-pre-wrap font-mono leading-relaxed">
              {candidate.rawText}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
}
