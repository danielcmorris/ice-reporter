import { Component } from '@angular/core';
import { ReportUploadComponent } from '../../components/report-upload/report-upload.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReportUploadComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {

}
