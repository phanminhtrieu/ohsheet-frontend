import { Injectable } from '@angular/core';
import { Endpoints, Methods } from 'app/enums/api';
import { response } from 'express';
import { METHODS } from 'http';
import { BehaviorSubject, catchError, map, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AnonymousSubscriptionService {

  constructor(
    private apiService: ApiService
  ) { }

  sendFeedback(request: any) {
    return this.apiService
      .request(
        Endpoints.ANONYMOUS_SUBSCRIPTION,
        Methods.POST,
        {
          params: {},
          body: request
        }
      )
      .pipe(
        map(response => response.resultObj),
        // catchError(async(err) => console.log(err))
      );
  }
}
