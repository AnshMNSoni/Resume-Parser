'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Archive, FileText, X, AlertCircle } from 'lucide-react';

export default function BulkUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [batchName, setBatchName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  
  const [targetRole, setTargetRole] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');

  const isZip = files.length === 1 && files[0].name.toLowerCase().endsWith('.zip');

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setProgress({ current: 0, total: files.length, status: 'Uploading files...' });

    try {
      const formData = new FormData();
      formData.append('batchName', batchName || `Batch ${new Date().toLocaleDateString()}`);
      formData.append('targetRole', targetRole);
      formData.append('requiredSkills', requiredSkills);

      if (isZip) {
        formData.append('zip', files[0]);
      } else {
        files.forEach((file) => formData.append('files', file));
      }

      setProgress((p) => ({ ...p, status: 'Processing resumes with AI...' }));

      const res = await fetch('/api/resume/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Bulk upload failed');
      }

      setProgress({ current: data.processed, total: data.total, status: 'Complete!' });

      // Navigate to candidates with batch filter
      setTimeout(() => {
        router.push(`/candidates?batchId=${data.batchId}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Bulk <span className="gradient-text">Resume Upload</span>
        </h1>
        <p className="text-sm text-dark-300">
          Upload multiple PDF resumes or a ZIP archive. All resumes will be processed and scored automatically.
        </p>
      </div>

      {/* Batch Setup */}
      <div className="bg-dark-800/80 border border-white/5 rounded-2xl p-6 animate-slide-up space-y-4">
        <div>
          <label htmlFor="batch-name" className="block text-xs font-semibold text-white mb-2 uppercase tracking-wider">
            Batch Name (optional)
          </label>
          <input
            id="batch-name"
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="e.g., Frontend Developers Q1 2025"
            disabled={uploading}
            className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-accent-emerald/50 focus:ring-1 focus:ring-accent-emerald/20 transition-all disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="target-role" className="block text-xs font-semibold text-dark-300 mb-2 uppercase tracking-wider">
              Target Role
            </label>
            <input
              id="target-role"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Senior Frontend Engineer"
              disabled={uploading}
              className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-accent-emerald/50 focus:ring-1 focus:ring-accent-emerald/20 transition-all disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="required-skills" className="block text-xs font-semibold text-dark-300 mb-2 uppercase tracking-wider">
              Key Requirements
            </label>
            <input
              id="required-skills"
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g., React, TypeScript, System Design"
              disabled={uploading}
              className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-accent-emerald/50 focus:ring-1 focus:ring-accent-emerald/20 transition-all disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        {files.length === 0 ? (
          <FileDropzone
            onFilesSelected={(newFiles) => {
              setFiles(newFiles);
              setError(null);
            }}
            accept=".pdf,.zip"
            multiple={true}
            maxSizeMB={50}
            label="Drop resumes or ZIP file here"
            sublabel="PDF files or ZIP archive containing PDFs"
            disabled={uploading}
          />
        ) : (
          <div className="gradient-card rounded-2xl p-6 space-y-4">
            {/* File list */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">
                {isZip ? 'ZIP Archive' : `${files.length} Files Selected`}
              </h3>
              {!uploading && (
                <button
                  onClick={() => setFiles([])}
                  className="text-xs text-dark-400 hover:text-accent-rose transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/30 border border-white/[0.03]"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isZip ? 'bg-accent-teal/10' : 'bg-accent-emerald/10'
                  }`}>
                    {isZip ? (
                      <Archive className="w-4 h-4 text-accent-teal" strokeWidth={1.5} />
                    ) : (
                      <FileText className="w-4 h-4 text-accent-emerald" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-dark-100 truncate">{file.name}</p>
                    <p className="text-[11px] text-dark-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  {!uploading && (
                    <button
                      onClick={() => removeFile(i)}
                      className="text-dark-500 hover:text-accent-rose transition-colors p-1"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Progress */}
            {uploading && (
              <div className="space-y-3 pt-2">
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-accent rounded-full transition-all duration-500"
                    style={{
                      width: progress.total > 0
                        ? `${(progress.current / progress.total) * 100}%`
                        : '100%',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-xs text-dark-300">{progress.status}</span>
                  </div>
                  {progress.total > 0 && (
                    <span className="text-xs text-dark-400 font-mono">
                      {progress.current}/{progress.total}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-rose/5 border border-accent-rose/20">
                <AlertCircle className="w-5 h-5 text-accent-rose flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-sm text-accent-rose">{error}</p>
              </div>
            )}

            {/* Actions */}
            {!uploading && (
              <div className="flex gap-3 pt-2">
                <button
                  id="bulk-analyze-btn"
                  onClick={handleUpload}
                  className="flex-1 gradient-accent text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                >
                  Analyze {isZip ? 'ZIP Archive' : `${files.length} Resumes`}
                </button>
                <button
                  onClick={() => {
                    const input = document.querySelector<HTMLInputElement>('#file-input');
                    if (input) input.click();
                  }}
                  className="px-4 py-3 rounded-xl border border-dark-600 text-sm font-medium text-dark-300 hover:text-white hover:border-dark-500 transition-all"
                >
                  + Add More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
