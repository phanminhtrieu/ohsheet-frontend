import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { ButtonModule } from 'primeng/button';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { CommonModule } from '@angular/common'; 
import { InputGroupModule } from 'primeng/inputgroup'; 
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from './core/services/notification.service';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ApiService } from './core/services/api.service';
import { Endpoints, Methods } from './enums/api';
import { LandingListComponent } from './pages/landing/pages/landing-list/landing-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ButtonModule, TopbarComponent, InputGroupModule, InputTextModule, FloatLabel, ToastModule, LandingListComponent],
  templateUrl: './app.component.html', // test
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
