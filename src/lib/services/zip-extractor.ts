import AdmZip from 'adm-zip';

export interface ExtractedFile {
  fileName: string;
  buffer: Buffer;
}

export function extractPDFsFromZip(zipBuffer: Buffer): ExtractedFile[] {
  try {
    const zip = new AdmZip(zipBuffer);
    const entries = zip.getEntries();
    const pdfFiles: ExtractedFile[] = [];

    for (const entry of entries) {
      // Skip directories and hidden/system files
      if (entry.isDirectory) continue;
      if (entry.entryName.startsWith('__MACOSX')) continue;
      if (entry.entryName.startsWith('.')) continue;

      // Only process PDF files
      const fileName = entry.entryName.split('/').pop() || entry.entryName;
      if (!fileName.toLowerCase().endsWith('.pdf')) continue;

      const buffer = entry.getData();
      if (buffer.length > 0) {
        pdfFiles.push({
          fileName,
          buffer,
        });
      }
    }

    if (pdfFiles.length === 0) {
      throw new Error('No PDF files found in the ZIP archive');
    }

    return pdfFiles;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('No PDF')) throw error;
      throw new Error(`Failed to extract ZIP: ${error.message}`);
    }
    throw new Error('Failed to extract ZIP: Unknown error');
  }
}
