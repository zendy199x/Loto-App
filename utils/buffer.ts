import { Readable } from 'stream';

export async function buffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  
  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}