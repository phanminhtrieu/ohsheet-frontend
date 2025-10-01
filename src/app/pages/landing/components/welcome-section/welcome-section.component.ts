import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { emailPatternValidator } from 'app/shared/validators/email.validator';
import { LocalHostConstant } from 'app/shared/constants';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-welcome-section',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule, 
    InputTextModule, 
    FloatLabel,
    DialogModule,
    ReactiveFormsModule,
    GalleriaModule],
  templateUrl: './welcome-section.component.html',
  styleUrl: './welcome-section.component.scss'
})
export class WelcomeSectionComponent {
  @Output() scrollToFeature = new EventEmitter<void>();

  images = [
    {
      src: '/assets/imgs/work-flow.png',
      alt: '',
      title: 'Create your sheet'
    },
    {
      src: '/assets/imgs/work-flow-1.png',
      alt: '',
      title: 'Find your sheet'
    },
  ]

  isSubmitted = false;
  isUserExist = false;
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
  welcomeBoxVisible = false;
  guideBoxVisible = false;
  mainButtonVisible = false;

  // Input name dialog
  inputNameDialogVisible = false;

  // AnonymousInput
  anonymousUser = {
    email: null,
    name: null,
  }

  formName: FormGroup;
  formEmail: FormGroup;

  constructor(
    
    private localStorageService: LocalStorageService,
    private fb: FormBuilder
  ) {
    this.formName = this.fb.group({
      name: ['', Validators.required]
    });

    this.formEmail = this.fb.group({
      email: ['', [Validators.required, emailPatternValidator()]]
    });
  }

  ngOnInit(): void {
    const anonymousUser = this.localStorageService.getItem(LocalHostConstant.ANONYMOUS_USER);

    if (anonymousUser) {
      this.anonymousUser = { ...anonymousUser }
      this.isUserExist = true;
    }
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

  showInputNameDialog(): void{
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

  logoutAnonymousUser() {
    this.localStorageService.removeItem(LocalHostConstant.ANONYMOUS_USER);
    this.isUserExist = false;

    console.log("abc");
  }
}
