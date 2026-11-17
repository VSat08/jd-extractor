/**
 * Client-Side PDF Text Extractor using pdfjs-dist
 * 100% Local & Private: Extracts raw textual content directly in browser memory.
 */

// Polyfill Promise.try for environments/browsers that do not yet support ECMAScript Promise.try
if (typeof Promise.try !== 'function') {
  Promise.try = function (fn, ...args) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure worker URL for Vite bundling
if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

/**
 * Extracts plain text from an ArrayBuffer containing a PDF document
 * @param {ArrayBuffer} arrayBuffer 
 * @returns {Promise<string>}
 */
export async function extractTextFromPdfBuffer(arrayBuffer) {
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw new Error('Empty PDF file provided.');
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    const pageTexts = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY = null;
      let pageStr = '';

      for (const item of textContent.items) {
        if (!item.str) continue;

        // Check if item is on a new line
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageStr += '\n';
        } else if (pageStr.length > 0 && !pageStr.endsWith(' ') && !pageStr.endsWith('\n')) {
          pageStr += ' ';
        }

        pageStr += item.str;
        lastY = item.transform[5];
      }

      if (pageStr.trim()) {
        pageTexts.push(pageStr.trim());
      }
    }

    const fullText = pageTexts.join('\n\n');
    if (!fullText.trim()) {
      throw new Error('This PDF appears to contain only scanned images or protected vector graphics without extractable text.');
    }

    return fullText;
  } catch (err) {
    if (err?.name === 'PasswordException') {
      throw new Error('Password-protected PDFs are not supported. Please upload an unlocked PDF.');
    }
    if (err?.message?.includes('Invalid PDF structure')) {
      throw new Error('Corrupted or invalid PDF file.');
    }
    throw err;
  }
}

/**
 * Reads a File object (PDF or Text) and returns the extracted textual content
 * @param {File} file 
 * @returns {Promise<{ text: string, fileName: string, fileSize: number }>}
 */
export async function extractTextFromFile(file) {
  if (!file) throw new Error('No file provided.');

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isTxt = file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.md');

  if (isPdf) {
    const buffer = await file.arrayBuffer();
    const text = await extractTextFromPdfBuffer(buffer);
    return {
      text,
      fileName: file.name,
      fileSize: file.size,
    };
  }

  if (isTxt) {
    const text = await file.text();
    return {
      text,
      fileName: file.name,
      fileSize: file.size,
    };
  }

  throw new Error('Unsupported format. Please upload a PDF (.pdf) or text (.txt, .md) resume.');
}
