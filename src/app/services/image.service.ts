import { Injectable } from '@angular/core';
 import { Observable, of } from 'rxjs';
import {  NgbSlideLike } from '../models/image';
import { ImageMeta } from '../models/image-meta';
import exifr from 'exifr';
 
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }


  getImageList(): Observable<NgbSlideLike[]> {

/*
slide1
'https://www.reuters.com/resizer/v2/DC6BS7VVAZJCJL7NGP22PDHT6A.jpg?auth=e19aa1c3e6a4488d6b020aaf8a763ccdb2cc0a853b71c29f270c6d3aebeba29f&width=1920&quality=80',



*/


    let urls: NgbSlideLike[] = [{
      src:'assets/images/slideshow/slide1.jpg',
      caption: 'Protesters confront immigration agents in Chicago and are attacked with CS Gas canisters',
      alt: 'Protesters confront immigration agents in Chicago',
      header: 'ICE shoot woman at Chicago protest'
    },
    {
      src:'assets/images/slideshow/slide2.jpg',
       header: 'ICE Agents Shoot Priest',
      alt: 'Priest shot during protest',
      caption: 'Border Patrol Agents Shoot Priest at Chicago Protest'
    },
    {
      src:'assets/images/slideshow/slide3.jpg',
      header: 'ICE attacks Chicago',
      alt: 'Chicago Residents gassed by ICE agents for protesting',
      caption: 'Residents have begun forming volunteer groups to monitor their neighborhoods for federal immigration agents.'
    },
    {
      src:'assets/images/slideshow/slide4.jpg',
      header: 'LA Overrun by Attacks from ICE',
      alt: 'LA Residents beaten and arrested by ICE agents for protesting',
      caption: 'People in LA who showed up to protest were met with force.'
    }
  ]

    return of(urls);

   }




    /** Get metadata for a single File (no upload needed). */
  async getImageMetadata(file: File): Promise<ImageMeta> {
    const meta: ImageMeta = {
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      lastModified: file.lastModified,
    };

    if (!file.type.startsWith('image/')) return meta;

    // Dimensions
    try {
      const bmp = await createImageBitmap(file);
      meta.width = bmp.width;
      meta.height = bmp.height;
      bmp.close();
    } catch {
      try {
        const { width, height } = await this.loadImageDimensionsFallback(file);
        meta.width = width;
        meta.height = height;
      } catch {
        // swallow dimension errors; meta stays without width/height
      }
    }

    // EXIF/GPS/XMP
    try {
      const exifData = await exifr.parse(file, {
        tiff: true,
        exif: true,
        gps: true,
        xmp: true,
        icc: false,
      });

      if (exifData) {
        meta.exif = exifData as Record<string, any>;
        meta.dateTaken =
          (exifData['DateTimeOriginal'] ||
           exifData['CreateDate'] ||
           null)?.toString?.() ?? null;
        meta.cameraMake = (exifData['Make'] as string) ?? null;
        meta.cameraModel = (exifData['Model'] as string) ?? null;
        meta.orientation = (exifData['Orientation'] as number) ?? null;

        const lat = exifData['latitude'] as number | undefined;
        const lng = exifData['longitude'] as number | undefined;
        meta.gps = (lat != null && lng != null) ? { latitude: lat, longitude: lng } : null;
      }
    } catch {
      // Some formats simply won't have EXIF; ignore gracefully
    }

    return meta;
  }

  /** Convenience: get metadata for multiple files. */
  async getForFiles(files: File[]): Promise<ImageMeta[]> {
    return Promise.all(files.map(f => this.getImageMetadata(f)));
  }

  // ---- helpers ----
  private loadImageDimensionsFallback(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        URL.revokeObjectURL(url);
        resolve({ width, height });
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      img.src = url;
    });
  }
}
 
