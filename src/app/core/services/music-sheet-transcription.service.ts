import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Endpoints, Methods } from 'app/enums/api';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { LocalHostConstant } from 'app/shared/constants';

@Injectable({
    providedIn: 'root'
})
export class MusicSheetTranscriptionService {

    constructor(
        private apiService: ApiService,
        private localStorageService: LocalStorageService
    ) { }

    transcribe(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('File', file);

        return this.apiService
            .request(
                Endpoints.MUSIC_TRANSCRIPTION_TRANSCRIBE,
                Methods.POST,
                { body: formData }
            )
            .pipe(
                tap((response) => {
                    if (response.resultObj.transcription_id) {
                        this.localStorageService.setItem(LocalHostConstant.TRANSCRIPTION_ID, response.resultObj.transcription_id);
                    }
                }),
                catchError((error) => throwError(() => error))
            );
    }
}
