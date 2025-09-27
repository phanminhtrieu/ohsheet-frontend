import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private requestInProgress = new BehaviorSubject<boolean>(false);
  
  constructor() { }

  setRequestInProgress(state: boolean): void {
		this.requestInProgress.next(state);
	}
}

