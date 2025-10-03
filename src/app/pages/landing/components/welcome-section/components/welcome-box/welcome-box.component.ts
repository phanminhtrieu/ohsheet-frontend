import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-welcome-box',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    FloatLabel, 
    ButtonModule],
  templateUrl: './welcome-box.component.html',
  styleUrl: './welcome-box.component.scss'
})
export class WelcomeBoxComponent {
  // trạng thái do parent điều khiển
  @Input() visible = false;
  @Input() isSubmitted = false;
  @Input() isUserExist = false;
  @Input() anonymousUser: any = { email: null, name: null };
  @Input() formEmail: any; // FormGroup từ parent
  @Input() pointerWelcomeBoxVisible = false;
  @Input() hideWelcomeBoxPointer = false;

  // events để parent xử lý (giữ nguyên logic ở parent)
  @Output() showLeftBackground = new EventEmitter<void>();
  @Output() showInputNameDialog = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
