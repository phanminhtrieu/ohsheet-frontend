import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SignalrService {
    private hubConnection!: signalR.HubConnection;
    public notificationReceived$ = new Subject<any>();

    constructor() { }

    public startConnection(token: string) {
        const hubUrl = environment.apiUrl.replace('/api/frontend', '') + '/notificationHub';

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('SignalR Connection Started'))
            .catch((err: any) => console.log('Error while starting SignalR connection: ' + err));

        this.hubConnection.on('ReceiveNotification', (data: any) => {
            this.notificationReceived$.next(data);
        });
    }

    public stopConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop();
        }
    }
}
