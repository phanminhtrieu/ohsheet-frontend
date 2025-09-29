import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, FloatLabel],
  templateUrl: './welcome-section.component.html',
  styleUrl: './welcome-section.component.scss'
})
export class WelcomeSectionComponent {
  @Output() scrollToFeature = new EventEmitter<void>();

  playGuideVisible = true;
  
  // Welcome Box
  pointerWelcomeBoxVisible = false;
  hideWelcomeBoxPointer = false;
  
  // Guide Box
  pointerGuideBoxVisible = false;
  hideGuideBoxPointer = false;

  // Background
  leftBackgroundVisible = false;
  rightBackgroundVisible = false;
  welcomeBoxVisible = false;
  guideBoxVisible = false;
  mainButtonVisible = false;

  emailInput: string | undefined;

  hidePlayGuide() {
    this.playGuideVisible = false;
  }

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

  showWelcomeBox() {
    this.welcomeBoxVisible = true;
    this.pointerWelcomeBoxVisible = true;
    this.hidePlayGuide();
  }

  showGuideBox() {
    this.guideBoxVisible = true;
    this.pointerWelcomeBoxVisible = true;
    this.pointerGuideBoxVisible = true;
  }

  showMainButton() {
    this.mainButtonVisible = true;
  }

  onScrollToFeature() {
    this.scrollToFeature.emit();
  }
}
