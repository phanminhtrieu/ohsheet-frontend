import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Endpoints, Methods } from 'app/enums/api';

@Injectable({
    providedIn: 'root'
})
export class RecentlyViewedService {

    constructor(private apiService: ApiService) { }

    getRecentlyViewed(limit: number = 10): Observable<any> {
        return this.apiService.request(Endpoints.PROFILE_RECENTLY_VIEWED, Methods.GET, {
            params: { limit }
        });
    }

    recordView(musicSheetId: number): Observable<any> {
        return this.apiService.request(Endpoints.MUSIC_SHEET_VIEW, Methods.POST, {
            urlReplacements: { id: musicSheetId },
            skipSuccessNotification: true
        });
    }
}
