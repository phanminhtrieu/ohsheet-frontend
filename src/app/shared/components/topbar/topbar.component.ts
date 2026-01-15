import { Component, ViewChild, HostListener } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { NgFor, CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ComingSoonDialogComponent } from '../coming-soon-dialog/coming-soon-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MenuModule, Menu } from 'primeng/menu';
import { SignalrService } from 'app/core/services/signalr.service';
import { BackendNotificationService, NotificationDto } from 'app/core/services/backend-notification.service';
import { NotificationService } from 'app/core/services/notification.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';


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
    MenuModule,
    BadgeModule,
    OverlayPanelModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  items: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  comingSoonDialogVisible = false;
  currentUser$: Observable<any>;
  unreadCount = 0;
  notifications: NotificationDto[] = [];

  @ViewChild('menu') menu!: Menu;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.menu) {
      this.menu.hide();
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private signalrService: SignalrService,
    private backendNotificationService: BackendNotificationService,
    private notificationService: NotificationService
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

    this.currentUser$.subscribe(user => {
      if (user) {
        this.signalrService.startConnection(user.token);
        this.loadNotifications();
      } else {
        this.signalrService.stopConnection();
      }
    });

    this.signalrService.notificationReceived$.subscribe(notif => {
      this.notifications.unshift(notif);
      this.unreadCount++;
      // Show toast notification
      this.notificationService.showInfoNotificatoin(notif.message, 'New Notification');
    });
  }

  loadNotifications() {
    this.backendNotificationService.getNotifications().subscribe(res => {
      if (res.isSucceeded) {
        this.notifications = res.resultObj;
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      }
    });
  }

  displayNotificationDialog: boolean = false;
  selectedNotification: NotificationDto | null = null;

  markAsRead(notif: NotificationDto) {
    this.selectedNotification = notif;
    this.displayNotificationDialog = true;

    if (!notif.isRead) {
      this.backendNotificationService.markAsRead(notif.id).subscribe({
        next: (res) => {
          if (res.isSucceeded) {
            notif.isRead = true;
            this.unreadCount--;
          }
        },
        error: (err) => console.error('[Topbar] Error marking as read:', err)
      });
    }
  }

  navigateToRelatedEntity() {
    if (this.selectedNotification && this.selectedNotification.relatedId) {
      this.displayNotificationDialog = false;
      this.router.navigate(['/music-sheets', this.selectedNotification.relatedId]);
    }
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
