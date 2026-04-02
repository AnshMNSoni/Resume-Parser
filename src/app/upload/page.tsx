'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress('Parsing resume...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress('Analyzing with AI...');
      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress('Complete!');
      router.push(`/candidate/${data.candidate.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUploading(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Upload <span className="gradient-text">Single Resume</span>
        </h1>
        <p className="text-sm text-dark-300">
          Upload a PDF resume and get instant AI-powered analysis with detailed scores and insights.
        </p>
      </div>

      {/* Upload Area */}
      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        {!file ? (
          <FileDropzone
            onFilesSelected={(files) => {
              setFile(files[0]);
              setError(null);
            }}
            accept=".pdf"
            multiple={false}
            disabled={uploading}
          />
        ) : (
          <div className="gradient-card rounded-2xl p-6">
            {/* File preview */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                <p className="text-xs text-dark-400">{(file.size / 1024).toFixed(1)} KB · PDF</p>
              </div>
              {!uploading && (
                <button
                  onClick={() => {
                    setFile(null);
                    setError(null);
                  }}
                  className="text-dark-400 hover:text-dark-200 transition-colors p-1"
                  id="remove-file-btn"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Progress */}
            {uploading && (
              <div className="mb-6 space-y-3">
                <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full gradient-accent rounded-full animate-shimmer" style={{ width: '100%' }} />
                </div>
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-xs text-dark-300">{progress}</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-accent-rose/5 border border-accent-rose/20">
                <svg className="w-5 h-5 text-accent-rose flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-accent-rose font-medium">Upload Failed</p>
                  <p className="text-xs text-dark-400 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                id="analyze-btn"
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 gradient-accent text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                {uploading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
              {!uploading && (
                <button
                  onClick={() => {
                    setFile(null);
                    setError(null);
                  }}
                  className="px-6 py-3 rounded-xl border border-dark-600 text-sm font-medium text-dark-300 hover:text-white hover:border-dark-500 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
        {[
          { icon: '🔍', title: 'Smart Parsing', desc: 'Extracts contact info, skills, and experience' },
          { icon: '🤖', title: 'AI Analysis', desc: 'Gemini-powered scoring across 4 categories' },
          { icon: '📊', title: 'Detailed Report', desc: 'Visual dashboard with actionable feedback' },
        ].map((item) => (
          <div key={item.title} className="gradient-card rounded-xl p-4 text-center">
            <span className="text-2xl mb-2 block">{item.icon}</span>
            <p className="text-xs font-semibold text-dark-100 mb-0.5">{item.title}</p>
            <p className="text-[11px] text-dark-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
