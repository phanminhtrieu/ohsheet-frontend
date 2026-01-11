import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { AuthService } from 'app/core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { emailPatternValidator } from 'app/shared/validators/email.validator';
import { LocalHostConstant } from 'app/shared/constants';
import { GalleriaModule } from 'primeng/galleria';

import { PositionWrapperComponent } from 'app/shared/components/position-wrapper/position-wrapper.component';
import { PlayGuideComponent } from './components/play-guide/play-guide.component';
import { WelcomeBoxComponent } from './components/welcome-box/welcome-box.component';
import { GuideBoxComponent } from './components/guide-box/guide-box.component';
import { LeftBackgroundComponent } from './components/left-background/left-background.component';
import { RightBackgroundComponent } from './components/right-background/right-background.component';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    GalleriaModule,
    PositionWrapperComponent,
    PlayGuideComponent,
    WelcomeBoxComponent,
    GuideBoxComponent,
    LeftBackgroundComponent,
    RightBackgroundComponent,
  ],
  templateUrl: './welcome-section.component.html',
  styleUrl: './welcome-section.component.scss'
})
export class WelcomeSectionComponent {
  @Output() scrollToFeature = new EventEmitter<void>();

  images = [
    { src: '/assets/imgs/work-flow.png', alt: '', title: 'Create your sheet' },
    { src: '/assets/imgs/work-flow-1.png', alt: '', title: 'Find your sheet' },
  ];

  isSubmitted = false;
  isUserExist = false;
  isAuthenticatedUser = false;
  warningDialogVisible = false;

  // Guide
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

  // Box visibility
  welcomeBoxVisible = false;
  guideBoxVisible = false;
  mainButtonVisible = false;
  mainButtonSoftVisible = false;

  // Input dialog
  inputNameDialogVisible = false;

  anonymousUser = { email: null, name: null };
  displayUser: any = { name: null };

  formName: FormGroup;
  formEmail: FormGroup;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.formName = this.fb.group({ name: ['', Validators.required] });
    this.formEmail = this.fb.group({ email: ['', [Validators.required, emailPatternValidator()]] });
  }

  ngOnInit(): void {
    // Check localStorage for authenticated user first
    const storedUser = this.localStorageService.getItem(LocalHostConstant.USER);

    if (storedUser) {
      // Authenticated user exists in localStorage
      this.isAuthenticatedUser = true;
      this.isUserExist = true;
      this.displayUser = { name: storedUser.username || storedUser.firstName || storedUser.name };
    } else {
      // If no authenticated user, check for anonymous user
      const anonymousUser = this.localStorageService.getItem(LocalHostConstant.ANONYMOUS_USER);
      if (anonymousUser) {
        this.isAuthenticatedUser = false;
        this.anonymousUser = { ...anonymousUser };
        this.displayUser = { name: anonymousUser.name };
        this.isUserExist = true;
      } else {
        this.isUserExist = false;
      }
    }

    // Subscribe to auth changes for reactive updates
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isAuthenticatedUser = true;
        this.isUserExist = true;
        this.displayUser = { name: user.username || user.firstName || user.name };
      } else {
        // If no authenticated user, check for anonymous user
        this.isAuthenticatedUser = false;
        const anonymousUser = this.localStorageService.getItem(LocalHostConstant.ANONYMOUS_USER);
        if (anonymousUser) {
          this.anonymousUser = { ...anonymousUser };
          this.displayUser = { name: anonymousUser.name };
          this.isUserExist = true;
        } else {
          this.isUserExist = false;
        }
      }
    });
  }

  subscribe(): void {
    if (this.formName.invalid) {
      this.formName.markAllAsTouched();
      return;
    }
    this.anonymousUser.name = this.formName.value.name.trim();
    this.localStorageService.setItem(LocalHostConstant.ANONYMOUS_USER, { ...this.anonymousUser });
    this.inputNameDialogVisible = false;
    this.isSubmitted = true;
  }

  showInputNameDialog(): void {
    if (this.formEmail.invalid || this.formEmail == null) {
      this.formEmail.markAllAsTouched();
      this.warningDialogVisible = true;
      return;
    }
    this.anonymousUser.email = this.formEmail.value.email.trim();
    this.inputNameDialogVisible = true;
  }

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
    this.mainButtonSoftVisible = true;
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
    const element = document.getElementById("play-guide");

    if (element) {
      element.remove(); // Xóa trực tiếp
    }

    this.mainButtonVisible = true;
  }

  onScrollToFeature() {
    this.scrollToFeature.emit();
  }

  logout() {
    // Clear anonymous user data if exists
    if (this.isAuthenticatedUser) {
      this.authService.logout();
    }

    if (!this.localStorageService.getItem(LocalHostConstant.ANONYMOUS_USER)) {
      this.localStorageService.removeItem(LocalHostConstant.ANONYMOUS_USER);
    }
  }
}
