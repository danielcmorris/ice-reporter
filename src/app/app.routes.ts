import { Routes } from '@angular/router';
import { AboutComponent } from './views/about/about.component';
import { HomeComponent } from './views/home/home.component';
import { ReportComponent } from './views/report/report.component';

export const routes: Routes = [{
    path: '',
    component: HomeComponent,
    title: 'Home'
  }, {
    path: 'about',
    component: AboutComponent,
    title: 'About'
  },
  {
    path: 'report',
    component: ReportComponent,
    title: 'Report'
  },

];
