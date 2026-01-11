import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        RouterModule
    ],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
    userName = '';
    password = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    onSignIn() {
        if (!this.userName || !this.password) {
            this.notificationService.showErrorNotification('Please enter both username and password.');
            return;
        }

        const payload = {
            UserName: this.userName,
            Password: this.password
        };

        this.authService.signIn(payload).subscribe({
            next: (res) => {
                console.log("🫡", res);
                if (res.isSucceeded) {
                    this.authService.setCurrentUser(res.resultObj);
                    this.notificationService.showSuccessNotificatoin('Sign in successful!');
                    this.router.navigate(['/']);
                } else {
                    this.notificationService.showErrorNotification(res.message || 'Sign in failed.');
                }
            },
            error: (err) => {
                console.error('Sign in failed', err);
                // ApiService usually handles error notifications, but we can add a fallback here
            }
        });
    }
}
