// types.ts (optional)
export type ImageMeta = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  lastModified: number;      // epoch ms
  width?: number;
  height?: number;
  dateTaken?: string | null;
  cameraMake?: string | null;
  cameraModel?: string | null;
  orientation?: number | null;
  gps?: { latitude?: number; longitude?: number } | null;
  exif?: Record<string, any>; // full EXIF/XMP if you want to inspect
};