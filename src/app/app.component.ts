import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { ButtonModule } from 'primeng/button';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { CommonModule } from '@angular/common'; 
import { InputGroupModule } from 'primeng/inputgroup'; 
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from './core/services/notification.service';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ApiService } from './core/services/api.service';
import { Endpoints, Methods } from './enums/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ButtonModule, TopbarComponent, InputGroupModule, InputTextModule, FloatLabel, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ohsheet-frontend';
  
  // Play guide
  playGuideVisible = true;

  // Pointers to box
  pointerWelcomeBoxVisible = false;
  pointerGuideBoxVisible = false;
  hideWelcomeBoxPointer = false;
  hideGuideBoxPointer = false;

  // Background
  leftBackgroundVisible = false;
  rightBackgroundVisible = false;

  // Box
  welcomeBoxVisible = false;
  guideBoxVisible = false;

  // Main button - "Let reach it"
  mainButtonVisible = false;

  // Feature Section
  inputOptionsVisible = false;

  // Email input
  emailInput: string | undefined;

  constructor(
    private notificationService: NotificationService,
    private apiSerice: ApiService
  ) {
  }

  scrollToSection(sectionId: string) {
    const target = document.getElementById(sectionId);
    if (!target) return;
  
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800; // thời gian scroll (ms) => 1 giây
    let start: number | null = null;
  
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      window.scrollTo(0, startPosition + distance * percent);
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
  
    requestAnimationFrame(step);
  }

  // Hide Play Guide
  hidePlayGuide() {
    this.playGuideVisible = false;
  }

  // Show background
  showLeftBackground() {
    this.leftBackgroundVisible = true;
    this.pointerGuideBoxVisible = true;

    this.hideWelcomeBoxPointer = true;

    this.showGuideBox();
  }

  showRightBackground() {
    this.rightBackgroundVisible = true;

    this.hideGuideBoxPointer = true;

    this.showMainButton();
  }

  // Show Box
  showWelcomeBox() {
    this.welcomeBoxVisible = true;
    this.pointerWelcomeBoxVisible = true;

    this.hidePlayGuide();
  }

  showGuideBox(){
    this.guideBoxVisible = true;
    this.pointerWelcomeBoxVisible = true;
    this.pointerGuideBoxVisible = true;
  }

  // Show Main Button
  showMainButton(){
    this.mainButtonVisible = true;
  }

  toggleImgInputOption() {
    this.inputOptionsVisible = !this.inputOptionsVisible;
  }
}
