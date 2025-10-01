import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMARY_OUTLET } from '@angular/router';
import { AnonymousSubscriptionService } from 'app/core/services/anonymous-subscription.service';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { SpinnerService } from 'app/core/services/spinner.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-feature-section',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    DialogModule, 
    TextareaModule, 
    FormsModule,
    ProgressSpinnerModule ],
  templateUrl: './feature-section.component.html',
  styleUrl: './feature-section.component.scss'
})
export class FeatureSectionComponent {
  @Output() scrollToWelcome = new EventEmitter<void>();

  inputOptionsVisible = false;

  // Dialog
  feedbackDialogVisible = false;
  comingSoonDialogVisible = false;
  inputEmailFirstDialogVisible = false;


  isLoading!: any;
  
  feedback!: string;
  anonymousUser = {
    name: null,
    email: null,
    message: null
  }

  // Feedback button
  feedbackButtonVisible = false;

  constructor(
    private localStorageService: LocalStorageService,
    private anonymousSubscriptionService: AnonymousSubscriptionService,
    private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.isLoading = this.spinnerService.spinner$;
  }

  toggleImgInputOption() {
    this.inputOptionsVisible = !this.inputOptionsVisible;
    this.feedbackButtonVisible = true;
  }

  showDialog() {
    this.feedbackDialogVisible = true;
  }

  sendFeedback() {
    const anonymousUser = this.localStorageService.getItem("anonymousUser");
    
    if (!anonymousUser) {
      this.scrollToWelcome.emit();
      this.feedbackDialogVisible = false;
      this.inputEmailFirstDialogVisible = true;

      return;
    } 
    
    this.anonymousUser = { ...anonymousUser, message: this.feedback };
    
    if (this.anonymousUser.message) {
      this.anonymousSubscriptionService.sendFeedback(this.anonymousUser)
        .pipe(
          finalize(() => {
            this.feedbackDialogVisible = false;
            this.feedback = ''
          })
        )
        .subscribe(() => this.feedback = '');
    }
  }
  
  inputImg() {
    this.comingSoonDialogVisible = true
  }

  inputAudio() {
    this.comingSoonDialogVisible = true
  }
}
