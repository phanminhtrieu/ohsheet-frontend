import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Endpoints, Methods } from 'app/enums/api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommentService {

    constructor(private apiService: ApiService) { }

    getComments(sheetId: number): Observable<any> {
        return this.apiService.request(Endpoints.MUSIC_SHEET_COMMENTS, Methods.GET, {
            urlReplacements: { sheetId },
            skipSuccessNotification: true
        });
    }

    createComment(sheetId: number, content: string, parentId?: number): Observable<any> {
        return this.apiService.request(Endpoints.MUSIC_SHEET_COMMENTS, Methods.POST, {
            urlReplacements: { sheetId },
            body: { content, parentId },
            skipSuccessNotification: true
        });
    }

    deleteComment(sheetId: number, commentId: number): Observable<any> {
        return this.apiService.request(Endpoints.MUSIC_SHEET_COMMENT_DELETE, Methods.DELETE, {
            urlReplacements: { sheetId, commentId },
            skipSuccessNotification: true
        });
    }
}
