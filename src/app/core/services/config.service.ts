import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private requestInProgress = new BehaviorSubject<boolean>(false);
  
  constructor(private spinnerService: SpinnerService) { }

  setRequestInProgress(state: boolean): void {
    this.spinnerService.setState(state);
		this.requestInProgress.next(state);
	}
}

