import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { NotificationService } from './notification.service';
import { environment } from '@env/environment';
import { Endpoints, IApiOptions, Methods } from 'app/enums/api';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { SpinnerService } from './spinner.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string;
  private params = new Map<string, string | number>();
  private requestCount = 0;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) { 
    this.baseUrl = environment.apiUrl;
  }

  public request(url: Endpoints, method: Methods, options: IApiOptions = {}): Observable<any> {
    if (!this.isLegalUrl()) {
      return throwError(() => 'illegal url');
    }

    if (this.requestCount === 0) {
      this.configService.setRequestInProgress(true);
      this.requestInProgressTimeout();
    }

    this.requestCount += 1;
    this.configService.setRequestInProgress(true);

    const normalizedUrl = `${this.baseUrl}${this.normalizeUrl(url, options.urlReplacements!)}`;

    options.params =  options.params || {};

    return this.httpClient
      .request(method, normalizedUrl, {...options, withCredentials: true })
      .pipe(
        catchError((res) => {
          this.notificationService.showErrorNotification(res.error.Message || null);
          return throwError(() => res);
        }),
        tap((result) => {
          // if (result?.successMsg) { // shows success message to user if there is one included in the api result object
          //   this.notificationService.showMessageNotification(result.successMsg);
          // }
          if(!result.isSucceeded && result.message) {
            this.notificationService.showErrorNotification(result.message)
          }
          else if(result.isSucceeded) {
            this.notificationService.showSuccessNotificatoin('Successfully!');
          }
        }),
        finalize(() => {
          this.requestCount -= 1;
          if (this.requestCount === 0) {
            this.configService.setRequestInProgress(false);
          }
        })
      );
  }

  private normalizeUrl(url: Endpoints, params: {[key: string]: string | number}): string {
    return  Object.keys(params || {})
      .reduce((urlToCheck, paramName) => urlToCheck.replace(`:${paramName}`, params[paramName].toString()), url);
  }

  private requestInProgressTimeout() {
    setTimeout(() => this.configService.setRequestInProgress(false), 15000);
  }

  private isLegalUrl() {
    return true;
  }

  public setUrlParameter(parameter: string | number, name: string): void {
    this.params.set(name, parameter);
  }

  public clearUrlParameters(): void {
    this.params.clear();
  }
}


export enum RequestMethod {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch'
}