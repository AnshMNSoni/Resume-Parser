import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { StatCard } from '@/components/ui/StatCard';

import { Users, Target, Code, FolderOpen, FileUp, Files, ChevronRight } from 'lucide-react';

async function getDashboardStats() {
  try {
    const [totalCandidates, avgScores, recentCandidates, totalBatches] = await Promise.all([
      prisma.candidate.count(),
      prisma.score.aggregate({
        _avg: {
          technicalSkills: true,
          codingSkills: true,
          softSkills: true,
          overallJobFit: true,
        },
      }),
      prisma.candidate.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          fileName: true,
          createdAt: true,
          score: {
            select: { overallJobFit: true },
          },
        },
      }),
      prisma.batchUpload.count(),
    ]);

    return { totalCandidates, avgScores: avgScores._avg, recentCandidates, totalBatches };
  } catch {
    return { totalCandidates: 0, avgScores: { technicalSkills: null, codingSkills: null, softSkills: null, overallJobFit: null }, recentCandidates: [], totalBatches: 0 };
  }
}

export default async function HomePage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
          <span className="text-xs font-semibold text-accent-emerald uppercase tracking-wider">System Online</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome to <span className="gradient-text">HireLens</span>
        </h1>
        <p className="text-dark-300 text-sm md:text-base max-w-2xl">
          AI-powered resume intelligence platform. Upload resumes, get instant analysis,
          and find the best candidates with data-driven insights.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <Link href="/upload" id="quick-upload-single" className="group bg-dark-800 border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_40px_rgba(52,211,153,0.1)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center group-hover:bg-accent-emerald/20 transition-colors">
              <FileUp className="w-6 h-6 text-accent-emerald" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-0.5">Upload Single Resume</h3>
              <p className="text-xs text-dark-400">Analyze one resume with detailed AI insights</p>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-500 ml-auto group-hover:text-accent-emerald group-hover:translate-x-1 transition-all" strokeWidth={2} />
          </div>
        </Link>

        <Link href="/upload/bulk" id="quick-upload-bulk" className="group bg-dark-800 border border-white/5 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_40px_rgba(20,184,166,0.1)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-teal/10 flex items-center justify-center group-hover:bg-accent-teal/20 transition-colors">
              <Files className="w-6 h-6 text-accent-teal" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-0.5">Bulk Upload</h3>
              <p className="text-xs text-dark-400">Process multiple resumes or ZIP files at once</p>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-500 ml-auto group-hover:text-accent-teal group-hover:translate-x-1 transition-all" strokeWidth={2} />
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Candidates"
          value={stats.totalCandidates}
          color="blue"
          delay={0}
          icon={<Users className="w-5 h-5" strokeWidth={1.8} />}
        />
        <StatCard
          label="Avg. Job Fit"
          value={stats.avgScores.overallJobFit ? `${Math.round(stats.avgScores.overallJobFit)}%` : '—'}
          color="emerald"
          delay={100}
          icon={<Target className="w-5 h-5" strokeWidth={1.8} />}
        />
        <StatCard
          label="Avg. Technical"
          value={stats.avgScores.technicalSkills ? `${Math.round(stats.avgScores.technicalSkills)}%` : '—'}
          color="purple"
          delay={200}
          icon={<Code className="w-5 h-5" strokeWidth={1.8} />}
        />
        <StatCard
          label="Batch Uploads"
          value={stats.totalBatches}
          color="amber"
          delay={300}
          icon={<FolderOpen className="w-5 h-5" strokeWidth={1.8} />}
        />
      </div>

      {/* Recent Candidates */}
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Candidates</h2>
          {stats.totalCandidates > 0 && (
            <Link href="/candidates" className="text-xs font-medium text-accent-blue hover:text-accent-cyan transition-colors">
              View all →
            </Link>
          )}
        </div>

        {stats.recentCandidates.length === 0 ? (
          <div className="gradient-card rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/5 flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-dark-500" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-dark-300 mb-1">No resumes uploaded yet</p>
            <p className="text-xs text-dark-500">Upload your first resume to get started</p>
          </div>
        ) : (
          <div className="gradient-card rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Candidate</th>
                  <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Email</th>
                  <th className="text-center text-xs font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Job Fit</th>
                  <th className="text-right text-xs font-semibold text-dark-400 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCandidates.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/candidate/${c.id}`} className="text-sm font-medium text-dark-100 hover:text-accent-blue transition-colors">
                        {c.name || c.fileName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-dark-400 hidden md:table-cell">{c.email || '—'}</td>
                    <td className="px-5 py-3.5 text-center">
                      {c.score ? (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            c.score.overallJobFit >= 80
                              ? 'score-bg-excellent score-excellent'
                              : c.score.overallJobFit >= 65
                              ? 'score-bg-good score-good'
                              : c.score.overallJobFit >= 50
                              ? 'score-bg-average score-average'
                              : 'score-bg-poor score-poor'
                          }`}
                          style={{ fontFamily: 'var(--font-mono, monospace)' }}
                        >
                          {c.score.overallJobFit}%
                        </span>
                      ) : (
                        <span className="text-xs text-dark-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-dark-500 text-right hidden sm:table-cell">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
