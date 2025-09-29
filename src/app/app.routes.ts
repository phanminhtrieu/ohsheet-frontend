import { Routes } from '@angular/router';
import { AboutListComponent } from './pages/about/pages/about-list/about-list.component';
import { LandingListComponent } from './pages/landing/pages/landing-list/landing-list.component';

export const routes: Routes = [
    { path: '', component: LandingListComponent },
    { path: 'about', component: AboutListComponent },
    // { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '' } // fallback route
  ];