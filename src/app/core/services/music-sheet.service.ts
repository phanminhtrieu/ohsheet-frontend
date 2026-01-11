import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Endpoints, Methods } from 'app/enums/api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MusicSheetService {

    constructor(private apiService: ApiService) { }

    createMusicSheet(userId: string, title: string, description: string, transcriptionId: string): Observable<any> {
        const body = {
            userId: userId,
            title: title,
            description: description,
            transcriptionId: transcriptionId
        };

        return this.apiService.request(Endpoints.MUSIC_SHEET, Methods.POST, { body });
    }
}
