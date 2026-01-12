import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Endpoints, Methods } from 'app/enums/api';
import { Observable } from 'rxjs';
import { DataTablePagedResult } from 'app/core/models/pagination.interface';
import { MusicSheet, MusicSheetPagingRequest } from 'app/core/models/music-sheet.interface';

@Injectable({
    providedIn: 'root'
})
export class MusicSheetService {

    constructor(private apiService: ApiService) { }

    createMusicSheet(userId: string, title: string, description: string, transcriptionId: string, thumbnail: File | null): Observable<any> {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('transcriptionId', transcriptionId);
        if (thumbnail) {
            formData.append('thumbnailFile', thumbnail);
        }

        return this.apiService.request(Endpoints.MUSIC_SHEET, Methods.POST, { body: formData });
    }

    getMusicSheetById(id: number): Observable<any> {
        return this.apiService.request(Endpoints.MUSIC_SHEET_DETAIL, Methods.GET, { urlReplacements: { id }, skipSuccessNotification: true });
    }

    getMusicSheets(request: MusicSheetPagingRequest): Observable<any> {
        return this.apiService.request(Endpoints.MUSIC_SHEET_PAGING, Methods.GET, { params: request, skipSuccessNotification: true });
    }

    likeMusicSheet(id: number): Observable<any> {
        return this.apiService.request(Endpoints.MUSIC_SHEET_LIKE, Methods.POST, { urlReplacements: { id } });
    }

    unlikeMusicSheet(id: number): Observable<any> {
        return this.apiService.request(Endpoints.MUSIC_SHEET_LIKE, Methods.DELETE, { urlReplacements: { id } });
    }
}
