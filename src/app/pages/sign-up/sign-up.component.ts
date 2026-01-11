import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        StepperModule,
        ToggleButtonModule
    ],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
    activeStep: number = 1;

    userName: string | undefined = undefined;
    firstName: string | undefined = undefined;
    lastName: string | undefined = undefined;
    email: string | undefined = undefined;
    password: string | undefined = undefined;

    // Interests
    option1: boolean | undefined = false;
    option2: boolean | undefined = false;
    option3: boolean | undefined = false;
    option4: boolean | undefined = false;
    option5: boolean | undefined = false;
    option6: boolean | undefined = false;
    option7: boolean | undefined = false;
    option8: boolean | undefined = false;
    option9: boolean | undefined = false;
    option10: boolean | undefined = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    onNextStep1(activateCallback: (step: number) => void) {
        if (this.userName && this.firstName && this.lastName && this.email && this.password) {
            activateCallback(2);
        } else {
            this.notificationService.showErrorNotification('Please fill in all required fields.');
        }
    }

    onSignUp() {
        const payload = {
            UserName: this.userName,
            FirstName: this.firstName,
            LastName: this.lastName,
            Email: this.email,
            Password: this.password
        };

        this.authService.signUp(payload).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this.activeStep = 3;
                }
            },
            error: (err) => {
                // ApiService handles error notification
                console.error('Sign up failed', err);
            }
        });
    }
}
