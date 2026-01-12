import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { NgFor, CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ComingSoonDialogComponent } from '../coming-soon-dialog/coming-soon-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';


import { Observable } from 'rxjs'; // Add import

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    MenubarModule,
    ButtonModule,
    AvatarModule,
    CommonModule,
    DialogModule,
    ComingSoonDialogComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  items: MenuItem[] = [];
  comingSoonDialogVisible = false;
  currentUser$: Observable<any>;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
      { label: 'Sheet', icon: 'pi pi-book', routerLink: '/music-sheets' },
      // { label: 'Features', icon: 'pi pi-star', routerLink: '/features' },
      // { label: 'About', icon: 'pi pi-info-circle', routerLink: '/about' },
    ];
  }

  showComingSoonDialog() {
    this.comingSoonDialogVisible = true
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  navigateToSignIn() {
    this.router.navigate(['/sign-in']);
  }

  logout() {
    this.authService.logout();
  }
}
