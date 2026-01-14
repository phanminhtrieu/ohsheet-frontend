import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Endpoints, Methods } from 'app/enums/api';
import { Observable } from 'rxjs';
import { PagingRequest } from 'app/core/models/pagination.interface';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private apiService: ApiService) { }

    getMyProfile(): Observable<any> {
        return this.apiService.request(Endpoints.PROFILE_ME, Methods.GET, { skipSuccessNotification: true });
    }

    updateMyProfile(payload: FormData): Observable<any> {
        return this.apiService.request(Endpoints.PROFILE_ME, Methods.PUT, { body: payload });
    }

    getMyLikedSheets(request: PagingRequest): Observable<any> {
        return this.apiService.request(Endpoints.PROFILE_LIKES, Methods.GET, { params: request, skipSuccessNotification: true });
    }
}
