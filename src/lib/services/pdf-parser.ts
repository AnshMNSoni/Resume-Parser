export interface ParsedPDF {
  text: string;
  pageCount: number;
  info: Record<string, unknown>;
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  try {
    // 100% bypass of Webpack/Turbopack interception.
    // This forces Node to use its native runtime require.
    const nativeRequire = eval('require');
    const pdfModule = nativeRequire('pdf-parse');

    // Sometimes the CJS export resolves to a wrapper object
    let parseFn = pdfModule;
    if (typeof pdfModule !== 'function') {
      parseFn = pdfModule.default;
      if (typeof parseFn !== 'function' && parseFn && typeof parseFn.default === 'function') {
        parseFn = parseFn.default;
      }
    }
    
    if (typeof parseFn !== 'function') {
        throw new Error(`Failed to resolve pdf-parse native function. Received: ${typeof parseFn}`);
    }

    const data = await parseFn(buffer);

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
      if (error.message.includes('empty')) {
        throw error;
      }
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
    throw new Error('Failed to parse PDF: Unknown error');
  }
}
