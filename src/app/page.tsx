import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { StatCard } from '@/components/ui/StatCard';

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
        <Link href="/upload" id="quick-upload-single" className="group gradient-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors">
              <svg className="w-6 h-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-0.5">Upload Single Resume</h3>
              <p className="text-xs text-dark-400">Analyze one resume with detailed AI insights</p>
            </div>
            <svg className="w-5 h-5 text-dark-500 ml-auto group-hover:text-accent-blue group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link href="/upload/bulk" id="quick-upload-bulk" className="group gradient-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center group-hover:bg-accent-purple/20 transition-colors">
              <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-0.5">Bulk Upload</h3>
              <p className="text-xs text-dark-400">Process multiple resumes or ZIP files at once</p>
            </div>
            <svg className="w-5 h-5 text-dark-500 ml-auto group-hover:text-accent-purple group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
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
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Avg. Job Fit"
          value={stats.avgScores.overallJobFit ? `${Math.round(stats.avgScores.overallJobFit)}%` : '—'}
          color="emerald"
          delay={100}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Avg. Technical"
          value={stats.avgScores.technicalSkills ? `${Math.round(stats.avgScores.technicalSkills)}%` : '—'}
          color="purple"
          delay={200}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          }
        />
        <StatCard
          label="Batch Uploads"
          value={stats.totalBatches}
          color="amber"
          delay={300}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          }
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
            <div className="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
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
