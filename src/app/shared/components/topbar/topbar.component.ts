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
import { MenuModule } from 'primeng/menu';


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
    ComingSoonDialogComponent,
    MenuModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  items: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
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

    this.userMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate(['/profile']);
        }
      },
      {
        label: 'My Sheets',
        icon: 'pi pi-file',
        command: () => {
          this.router.navigate(['/profile'], { queryParams: { tab: 1 } });
        }
      },
      {
        label: 'Liked Sheets',
        icon: 'pi pi-heart',
        command: () => {
          this.router.navigate(['/profile'], { queryParams: { tab: 2 } });
        }
      },
      {
        separator: true
      },
      {
        label: 'Log Out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
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
