import { Injectable } from '@angular/core';
import { share, Subject } from 'rxjs';

const LOCAL_STORAGE_PREFIX = 'ops.';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private _onSubject = new Subject<{ key: string, value: any }>(); // hot event, all subscriber receive one data at the time (private - can next())

  // With $, you can see that is a stream (can subscribe)
  public changes$ = this._onSubject.asObservable(); // Public - cannot next() just can subscribe

  constructor() {}

  public getItem(key: string): any {
    if (localStorage.getItem(LOCAL_STORAGE_PREFIX + key)) {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFIX + key)!);
    }

    return null;
  }

  public setItem(key: string, dataToStore: any): void {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(dataToStore));
    this._onSubject.next({key, value: dataToStore});
  }

  public removeItem(key: string): void {
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + key);
    this._onSubject.next({key, value: null});
  }
}
