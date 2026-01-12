import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    template: ''
})
export abstract class BaseComponent {
    constructor(@Inject(PLATFORM_ID) protected platformId: Object) { }

    get isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }
}
