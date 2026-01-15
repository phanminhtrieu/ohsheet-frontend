import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Endpoints, Methods } from 'app/enums/api';
import { Observable } from 'rxjs';

export interface NotificationDto {
    id: number;
    message: string;
    type: string;
    relatedId: string;
    createdAt: string;
    isRead: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class BackendNotificationService {
    constructor(private apiService: ApiService) { }

    getNotifications(): Observable<any> {
        return this.apiService.request(Endpoints.NOTIFICATIONS, Methods.GET);
    }

    markAsRead(id: number): Observable<any> {
        return this.apiService.request(`${Endpoints.NOTIFICATIONS}/${id}/read` as any, Methods.POST, {
            body: {},
            skipSuccessNotification: true
        });
    }
}
