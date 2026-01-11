import { Routes } from '@angular/router';
import { AboutListComponent } from './pages/about/pages/about-list/about-list.component';
import { LandingListComponent } from './pages/landing/pages/landing-list/landing-list.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';

export const routes: Routes = [
  { path: '', component: LandingListComponent },
  { path: 'about', component: AboutListComponent },
  // { path: 'profile', component: ProfileComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '**', redirectTo: '' } // fallback route
];