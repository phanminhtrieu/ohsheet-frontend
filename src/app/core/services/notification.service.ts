import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  showSuccessNotificatoin(detail: string, summary: string = 'Success', life: number = 3000) {
    this.messageService.add({ severity: 'success', summary, detail, life });
  }

  showErrorNotification(detail: string, summary: string = 'Error', life: number = 3000) {
    this.messageService.add({ severity: 'error', summary, detail, life });
  }

  showInfoNotificatoin(detail: string, summary: string = 'Info', life: number = 3000) {
    this.messageService.add({ severity: 'info', summary, detail, life });
  }
}
