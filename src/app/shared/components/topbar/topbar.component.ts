import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { NgFor } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    MenubarModule, 
    ButtonModule, 
    AvatarModule, 
    NgFor,
    DialogModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  items: MenuItem[] = [];
  comingSoonDialogVisible = false;

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
      // { label: 'Features', icon: 'pi pi-star', routerLink: '/features' },
      // { label: 'About', icon: 'pi pi-info-circle', routerLink: '/about' },
    ];
  }
  
  showComingSoonDialog() {
    this.comingSoonDialogVisible = true
  }
}
