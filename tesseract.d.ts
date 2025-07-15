// tesseract.d.ts
declare module "tesseract.js" {
  export function recognize(
    image: Blob | Buffer,
    lang: string
  ): Promise<{ data: { text: string } }>;
  export function createWorker(): Promise<{
    load(): Promise<any>;
    reinitialize(lang: string): Promise<any>;
    recognize(image: Blob | Buffer): Promise<{ data: { text: string } }>;
    terminate(): Promise<any>;
  }>;
  const Tesseract: {
    recognize(image: Blob | Buffer, lang: string): Promise<{ data: { text: string } }>;
    createWorker(): Promise<any>;
  };
  export default Tesseract;
}
