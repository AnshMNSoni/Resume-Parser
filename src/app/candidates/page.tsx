'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Search, Filter, FolderOpen } from 'lucide-react';

interface CandidateRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  fileName: string;
  createdAt: string;
  batchId: string | null;
  score: {
    technicalSkills: number;
    codingSkills: number;
    softSkills: number;
    overallJobFit: number;
  } | null;
  skills: { name: string; category: string }[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function CandidatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc');
  const [filters, setFilters] = useState({
    minTechnical: parseInt(searchParams.get('minTechnical') || '0'),
    minCoding: parseInt(searchParams.get('minCoding') || '0'),
    minSoftSkills: parseInt(searchParams.get('minSoftSkills') || '0'),
    minJobFit: parseInt(searchParams.get('minJobFit') || '0'),
  });
  const [showFilters, setShowFilters] = useState(false);
  const batchId = searchParams.get('batchId') || '';

  const fetchCandidates = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(batchId && { batchId }),
        ...(filters.minTechnical > 0 && { minTechnical: String(filters.minTechnical) }),
        ...(filters.minCoding > 0 && { minCoding: String(filters.minCoding) }),
        ...(filters.minSoftSkills > 0 && { minSoftSkills: String(filters.minSoftSkills) }),
        ...(filters.minJobFit > 0 && { minJobFit: String(filters.minJobFit) }),
      });

      const res = await fetch(`/api/resume/list?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setCandidates(data.candidates || []);
        setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, search, batchId, filters]);

  useEffect(() => {
    fetchCandidates(1);
  }, [fetchCandidates]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }: { column: string }) => (
    <span className={`ml-1 inline-block transition-transform ${sortBy === column ? 'text-accent-emerald' : 'text-dark-600'}`}>
      {sortBy === column ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const hasActiveFilters = Object.values(filters).some((v) => v > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          <span className="gradient-text">Candidates</span>
        </h1>
        <p className="text-sm text-dark-300">
          Browse, filter, and rank all analyzed resumes. Click on any row for detailed analysis.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" strokeWidth={2} />
          <input
            id="search-candidates"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or skills..."
            className="w-full bg-dark-800/50 border border-dark-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-accent-emerald/50 focus:ring-1 focus:ring-accent-emerald/20 transition-all"
          />
        </div>
        <button
          id="toggle-filters"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            hasActiveFilters
              ? 'border-accent-emerald/30 bg-accent-emerald/5 text-accent-emerald'
              : 'border-dark-600 text-dark-300 hover:text-white hover:border-dark-500'
          }`}
        >
          <Filter className="w-4 h-4" strokeWidth={2} />
          Filters {hasActiveFilters && `(${Object.values(filters).filter((v) => v > 0).length})`}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-5 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Minimum Score Thresholds</h3>
            {hasActiveFilters && (
              <button
                onClick={() => setFilters({ minTechnical: 0, minCoding: 0, minSoftSkills: 0, minJobFit: 0 })}
                className="text-xs text-accent-rose hover:text-accent-rose/80 transition-colors"
              >
                Reset all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'minTechnical' as const, label: 'Technical Skills' },
              { key: 'minCoding' as const, label: 'Coding / DSA' },
              { key: 'minSoftSkills' as const, label: 'Soft Skills' },
              { key: 'minJobFit' as const, label: 'Overall Job Fit' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-[11px] text-dark-400 font-medium mb-1.5">
                  {f.label}: <span className="text-accent-emerald font-mono">{filters[f.key]}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={filters[f.key]}
                  onChange={(e) => setFilters((prev) => ({ ...prev, [f.key]: parseInt(e.target.value) }))}
                  className="w-full h-1.5 rounded-full appearance-none bg-dark-700 accent-accent-emerald cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-dark-400">
          {loading ? 'Loading...' : `${pagination.total} candidate${pagination.total !== 1 ? 's' : ''} found`}
        </p>
        {batchId && (
          <Link href="/candidates" className="text-xs text-accent-blue hover:text-accent-cyan transition-colors">
            Clear batch filter ×
          </Link>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-12">
          <LoadingSpinner size="lg" className="mx-auto" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-white/5 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-dark-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-white mb-1">No candidates found</p>
          <p className="text-xs text-dark-500">
            {hasActiveFilters ? 'Try adjusting your filters' : 'Upload resumes to get started'}
          </p>
        </div>
      ) : (
        <div className="bg-dark-800/80 border border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5">
                <th
                  className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:text-dark-200 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Candidate <SortIcon column="name" />
                </th>
                <th
                  className="text-center text-xs font-semibold text-dark-400 uppercase tracking-wider px-3 py-3.5 cursor-pointer hover:text-dark-200 transition-colors"
                  onClick={() => handleSort('technicalSkills')}
                >
                  Technical <SortIcon column="technicalSkills" />
                </th>
                <th
                  className="text-center text-xs font-semibold text-dark-400 uppercase tracking-wider px-3 py-3.5 cursor-pointer hover:text-dark-200 transition-colors"
                  onClick={() => handleSort('codingSkills')}
                >
                  Coding <SortIcon column="codingSkills" />
                </th>
                <th
                  className="text-center text-xs font-semibold text-dark-400 uppercase tracking-wider px-3 py-3.5 cursor-pointer hover:text-dark-200 transition-colors"
                  onClick={() => handleSort('softSkills')}
                >
                  Soft Skills <SortIcon column="softSkills" />
                </th>
                <th
                  className="text-center text-xs font-semibold text-dark-400 uppercase tracking-wider px-3 py-3.5 cursor-pointer hover:text-dark-200 transition-colors"
                  onClick={() => handleSort('overallJobFit')}
                >
                  Job Fit <SortIcon column="overallJobFit" />
                </th>
                <th
                  className="text-right text-xs font-semibold text-dark-400 uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:text-dark-200 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  Date <SortIcon column="createdAt" />
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/candidate/${c.id}`)}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-accent-emerald transition-colors">
                        {c.name || c.fileName}
                      </p>
                      <p className="text-[11px] text-dark-500">{c.email || '—'}</p>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center">
                    {c.score ? <ScoreBadge score={c.score.technicalSkills} /> : '—'}
                  </td>
                  <td className="px-3 py-4 text-center">
                    {c.score ? <ScoreBadge score={c.score.codingSkills} /> : '—'}
                  </td>
                  <td className="px-3 py-4 text-center">
                    {c.score ? <ScoreBadge score={c.score.softSkills} /> : '—'}
                  </td>
                  <td className="px-3 py-4 text-center">
                    {c.score ? <ScoreBadge score={c.score.overallJobFit} /> : '—'}
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-dark-500 font-mono">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-dark-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchCandidates(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-dark-600 text-xs text-dark-300 hover:text-white hover:border-dark-500 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => fetchCandidates(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg border border-dark-600 text-xs text-dark-300 hover:text-white hover:border-dark-500 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="min-h-[60vh]" />}>
      <CandidatesContent />
    </Suspense>
  );
}
