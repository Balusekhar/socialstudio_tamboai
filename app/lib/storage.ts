import { storage, ID } from "./appwrite";

const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export async function uploadFile(file: File, onProgress?: (progress: number) => void) {
  const result = await storage.createFile({
    bucketId: BUCKET_ID,
    fileId: ID.unique(),
    file,
    onProgress: onProgress
      ? (p) => onProgress(Math.round((p.chunksUploaded / p.chunksTotal) * 100))
      : undefined,
  });
  return result;
}

export function getFileUrl(fileId: string) {
  return storage.getFileView({ bucketId: BUCKET_ID, fileId });
}
