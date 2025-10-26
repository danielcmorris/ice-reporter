import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgbConfig} from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from "./header/header.component";
import { ReportUploadComponent } from './components/report-upload/report-upload.component';
import { NgBootstrapSlideshowComponent } from './components/slide-show/slide-show.component';
import { ImageService } from './services/image.service';
import { Image, NgbSlideLike } from './models/image';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HeaderComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ice-reporter';
  imageList: NgbSlideLike[] = [];
  constructor(private imageService: ImageService) {
     this.imageService.getImageList()
      .subscribe((images: NgbSlideLike[]) => {

       

        this.imageList = images;});
  }

  ngOnInit() {
     this.toggleTheme();
  }
  toggleTheme() {
  const currentTheme = document.body.getAttribute('data-bs-theme');
  document.body.setAttribute('data-bs-theme', currentTheme === 'dark' ? 'light' : 'dark');
}

}
