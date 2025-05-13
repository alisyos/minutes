declare module 'pdf-parse';
declare module 'mammoth';
declare module 'docx-parser';
declare module 'html-to-docx';

declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }
  
  function pdfParse(dataBuffer: Buffer | Uint8Array, options?: any): Promise<PDFData>;
  export = pdfParse;
} 