import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadReportService {
  // Adjust to your API
  private baseUrl = '/api/reports';

  constructor(private http: HttpClient) {
    this.baseUrl = `https://localhost:7288`;

  }

  upload(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.baseUrl}/api/upload/file`, formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
