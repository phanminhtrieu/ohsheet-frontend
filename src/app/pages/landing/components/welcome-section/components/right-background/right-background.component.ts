import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-right-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-background.component.html',
  styleUrl: './right-background.component.scss'
})
export class RightBackgroundComponent {
  @Input() rightBackgroundVisible = false;
}
