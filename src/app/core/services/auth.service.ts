import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Endpoints, Methods } from 'app/enums/api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private apiService: ApiService) { }

    public signUp(payload: any): Observable<any> {
        return this.apiService.request(Endpoints.AUTH_SIGN_UP, Methods.POST, {
            body: payload
        });
    }
}
