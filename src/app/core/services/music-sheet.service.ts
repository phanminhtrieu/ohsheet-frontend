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

    createMusicSheet(userId: string, title: string, description: string, transcriptionId: string, thumbnail: File | null, tags: string[] = []): Observable<any> {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('transcriptionId', transcriptionId);
        if (thumbnail) {
            formData.append('thumbnailFile', thumbnail);
        }

        if (tags && tags.length > 0) {
            tags.forEach((tag, index) => {
                formData.append(`Tags[${index}]`, tag);
            });
        }

        return this.apiService.request(Endpoints.MUSIC_SHEET, Methods.POST, { body: formData });
    }

    updateMusicSheet(id: number, userId: string, title: string, description: string, tags: string[] = []): Observable<any> {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('title', title);
        formData.append('description', description);

        if (tags && tags.length > 0) {
            tags.forEach((tag, index) => {
                formData.append(`Tags[${index}]`, tag);
            });
        }

        return this.apiService.request(Endpoints.MUSIC_SHEET_DETAIL, Methods.PUT, { urlReplacements: { id }, body: formData });
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

    searchTags(query: string): Observable<any> {
        return this.apiService.request((Endpoints.MUSIC_SHEET + '/tags/search') as Endpoints, Methods.GET, { params: { query }, skipSuccessNotification: true });
    }
}
