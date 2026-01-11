import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Endpoints, Methods } from 'app/enums/api';
import { Observable, BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public currentUser$ = new BehaviorSubject<any>(null);

    constructor(
        private apiService: ApiService,
        private localStorageService: LocalStorageService,
        private router: Router
    ) {
        this.loadUserFromStorage();
    }

    public signUp(payload: any): Observable<any> {
        return this.apiService.request(Endpoints.AUTH_SIGN_UP, Methods.POST, {
            body: payload
        });
    }

    public signIn(payload: any): Observable<any> {
        return this.apiService.request(Endpoints.AUTH_SIGN_IN, Methods.POST, {
            body: payload
        });
    }

    public setCurrentUser(user: any): void {
        this.localStorageService.setItem('user', user);
        this.currentUser$.next(user);
    }

    public logout(): void {
        this.apiService.request(Endpoints.AUTH_LOGOUT, Methods.DELETE).subscribe({
            next: () => {
                this.clearLocalUser();
            },
            error: (err) => {
                console.error('Logout failed', err);
                this.clearLocalUser(); // Clear locally even if server fails
            }
        });
    }

    private clearLocalUser(): void {
        this.localStorageService.removeItem('user');
        this.currentUser$.next(null);
        this.router.navigate(['/']);
    }

    private loadUserFromStorage(): void {
        const user = this.localStorageService.getItem('user');
        if (user) {
            this.currentUser$.next(user);
        }
    }
}
