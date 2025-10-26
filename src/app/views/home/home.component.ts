import { Component } from '@angular/core';
import { ReportUploadComponent } from '../../components/report-upload/report-upload.component';
import { NgBootstrapSlideshowComponent } from '../../components/slide-show/slide-show.component';
import { NgbSlideLike } from '../../models/image';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReportUploadComponent,NgBootstrapSlideshowComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
imageList: NgbSlideLike[] = [];
  constructor(private imageService: ImageService) {
     this.imageService.getImageList()
      .subscribe((images: NgbSlideLike[]) => {

       

        this.imageList = images;});
  }

  
}
