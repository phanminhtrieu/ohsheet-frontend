import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';

const MyPreset = definePreset(Aura, {
  semantic: {
      primary: {
          50: '{neutral.50}',
          100: '{neutral.100}',
          200: '{neutral.200}',
          300: '{neutral.300}',
          400: '{neutral.400}',
          500: '{neutral.700}', // Nomarl state
          600: '{neutral.800}', // Hover state
          700: '{neutral.900}', // Click state
          800: '{neutral.800}',
          900: '{neutral.900}',
          950: '{neutral.950}'
      }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideClientHydration(), 
    providePrimeNG({ 
      theme: {
          preset: MyPreset,
          options: {
            darkModeSelector: 'light', 
          }
      }
    }),
    importProvidersFrom(
      BrowserAnimationsModule, 
      ToastModule,
      HttpClientModule),
    MessageService
  ]
};




