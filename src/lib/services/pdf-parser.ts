export interface ParsedPDF {
  text: string;
  pageCount: number;
  info: Record<string, unknown>;
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  // Guard: validate buffer before processing
  if (!buffer || buffer.length === 0) {
    throw new Error('PDF buffer is empty or invalid');
  }

  // Guard: reject excessively large PDFs early (4.5MB to respect serverless memory)
  const MAX_PDF_SIZE = 4.5 * 1024 * 1024;
  if (buffer.length > MAX_PDF_SIZE) {
    throw new Error(
      `PDF file is too large (${(buffer.length / 1024 / 1024).toFixed(1)}MB). Maximum: 4.5MB`
    );
  }

  try {
    // pdf-parse is listed in serverExternalPackages (next.config.ts)
    // so the bundler skips it, and Node.js loads it natively at runtime.
    // All API routes using this function must export `runtime = 'nodejs'`.
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF appears to be empty or contains no extractable text');
    }

    return {
      text: data.text.trim(),
      pageCount: data.numpages,
      info: data.info || {},
    };
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('empty') ||
        error.message.includes('too large') ||
        error.message.includes('no extractable text')
      ) {
        throw error;
      }
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
    throw new Error('Failed to parse PDF: Unknown error');
  }
}
