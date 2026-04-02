'use client';

import { useCallback, useState, useRef } from 'react';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
}

export function FileDropzone({
  onFilesSelected,
  accept = '.pdf',
  multiple = false,
  maxSizeMB = 10,
  label = 'Drop your resume here',
  sublabel = 'or click to browse',
  disabled = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFiles = useCallback(
    (fileList: FileList | null): File[] => {
      if (!fileList) return [];
      const files = Array.from(fileList);
      return files.filter((file) => {
        if (file.size > maxSizeMB * 1024 * 1024) return false;
        return true;
      });
    },
    [maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        onFilesSelected(multiple ? validFiles : [validFiles[0]]);
      }
    },
    [disabled, multiple, onFilesSelected, validateFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        onFilesSelected(multiple ? validFiles : [validFiles[0]]);
      }
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = '';
    },
    [multiple, onFilesSelected, validateFiles]
  );

  return (
    <div
      id="file-dropzone"
      className={`dropzone rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragging ? 'active' : ''
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
        id="file-input"
      />

      {/* Upload icon */}
      <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
        isDragging
          ? 'bg-accent-cyan/10 scale-110'
          : 'bg-accent-blue/10'
      }`}>
        <svg
          className={`w-8 h-8 transition-all duration-300 ${
            isDragging ? 'text-accent-cyan -translate-y-1' : 'text-accent-blue'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      <p className="text-base font-semibold text-dark-100 mb-1">{label}</p>
      <p className="text-sm text-dark-400 mb-4">{sublabel}</p>
      <div className="flex items-center justify-center gap-4 text-xs text-dark-500">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          PDF format
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Max {maxSizeMB}MB
        </span>
        {multiple && (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Multiple files
          </span>
        )}
      </div>
    </div>
  );
}
