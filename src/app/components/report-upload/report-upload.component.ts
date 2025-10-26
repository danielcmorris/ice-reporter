import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule, HttpEventType } from '@angular/common/http';
import { UploadReportService } from '../../services/upload-report.service';
import { ImageService } from '../../services/image.service';
 
type PreviewFile = {
  file: File;
  previewUrl?: string; // only for image types
};

@Component({
  selector: 'app-report-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './report-upload.component.html',
  styleUrls: ['./report-upload.component.scss'],
})
export class ReportUploadComponent implements OnDestroy {
  constructor(private fb: FormBuilder, private uploader: UploadReportService, private imageService: ImageService) {}

  // --- Reactive form ---
  form = this.fb.group({
    contact: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    }),
    description: ['', [Validators.required, Validators.minLength(10)]],
    locationText: [''], // human-readable location (address / intersection)
    latitude: [''],
    longitude: [''],
  });

  // --- Drag & Drop state ---
  isDragging = false;
  files: PreviewFile[] = [];

  // --- Upload state ---
  isSubmitting = false;
  progress = 0;
  serverMessage: string | null = null;
  serverError: string | null = null;

  // Allow only some file types? (set to undefined to allow all)
  allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/avif','image/webp',
    'application/pdf',
    'video/mp4', 'video/quicktime', 'video/webm'
  ];
  maxFiles = 20;
  maxTotalSizeMB = 500;

  // Clean up blob URLs
  ngOnDestroy(): void {
    this.files.forEach(f => {
      if (f.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(f.previewUrl);
    });
  }

  // --- Drag & drop handlers ---
  @HostListener('document:dragover', ['$event'])
  onDocDragOver(e: DragEvent) {
    e.preventDefault();
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    if (!e.dataTransfer?.files?.length) return;
    this.addFiles(e.dataTransfer.files);
  }

  onFileInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.addFiles(input.files);
    input.value = ''; // allow choosing same files again if needed
  }

  private addFiles(fileList: FileList) {
    const incoming = Array.from(fileList);
    const currentCount = this.files.length;
    const remainingSlots = this.maxFiles - currentCount;
    const accept = remainingSlots > 0 ? incoming.slice(0, remainingSlots) : [];

    const filtered = accept.filter(f => !this.allowedTypes || this.allowedTypes.includes(f.type));

    // Size gate (total)
    const totalBytes = [...this.files.map(f => f.file), ...filtered].reduce((sum, f) => sum + f.size, 0);
    const totalMB = totalBytes / (1024 * 1024);
    if (totalMB > this.maxTotalSizeMB) {
      this.serverError = `Total upload exceeds ${this.maxTotalSizeMB} MB. Please remove some files.`;
      return;
    }

    const newPreviews: PreviewFile[] = filtered.map(file => ({
      file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));




    this.files = [...this.files, ...newPreviews];

this.files.forEach(async f => {
    const metas = await this.imageService.getForFiles(filtered);
  console.log('image metas:', metas);
  
});


  }

  removeFile(i: number) {
    const item = this.files[i];
    if (item?.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
    this.files.splice(i, 1);
    this.files = [...this.files];
  }

  // Optional: quick geolocation fill
  fillGeoFromBrowser() {
    if (!navigator.geolocation) {
      this.serverError = 'Geolocation not supported by this browser.';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        this.form.patchValue({ latitude: String(latitude), longitude: String(longitude) });
        this.serverMessage = 'Coordinates captured from device.';
      },
      err => {
        this.serverError = `Geolocation failed: ${err.message}`;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Build and POST
  submit() {
    this.serverMessage = null;
    this.serverError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.serverError = 'Please fix the validation errors and try again.';
      return;
    }
    if (!this.files.length) {
      this.serverError = 'Please attach at least one file.';
      return;
    }

    const fd = new FormData();

    // Append structured data (you can also send as separate fields if you prefer)
    const payload = {
      contact: this.form.value.contact,
      description: this.form.value.description,
      locationText: this.form.value.locationText,
      latitude: this.form.value.latitude,
      longitude: this.form.value.longitude,
    };
    fd.append('metadata', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

    // Append files
    for (const pf of this.files) {
      fd.append('files', pf.file, pf.file.name);
    }

    this.isSubmitting = true;
    this.progress = 0;

    this.uploader.upload(fd).subscribe({
      next: evt => {
        if (evt.type === HttpEventType.UploadProgress && evt.total) {
          this.progress = Math.round((evt.loaded / evt.total) * 100);
        } else if (evt.type === HttpEventType.Response) {
          this.isSubmitting = false;
          this.serverMessage = 'Upload complete.';
          this.progress = 100;
          // Optionally reset the form & files
          this.form.reset();
          this.files.forEach(f => f.previewUrl?.startsWith('blob:') && URL.revokeObjectURL(f.previewUrl!));
          this.files = [];
        }
      },
      error: err => {
        this.isSubmitting = false;
        this.serverError = (err?.error?.message) || 'Upload failed.';
      }
    });
  }
}
