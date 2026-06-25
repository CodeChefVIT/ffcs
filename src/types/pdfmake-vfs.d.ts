declare module 'pdfmake/build/pdfmake' {
  const pdfMake: {
    vfs: Record<string, string>;
    createPdf: (doc: unknown) => { download: (fileName?: string) => void };
    [key: string]: unknown;
  };
  export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  const pdfFonts: { vfs: Record<string, string> };
  export default pdfFonts;
}
