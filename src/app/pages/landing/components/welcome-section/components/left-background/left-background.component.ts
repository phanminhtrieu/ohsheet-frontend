import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PositionWrapperComponent } from 'app/shared/components/position-wrapper/position-wrapper.component';

@Component({
  selector: 'app-left-background',
  standalone: true,
  imports: [CommonModule, PositionWrapperComponent],
  templateUrl: './left-background.component.html',
  styleUrl: './left-background.component.scss'
})
export class LeftBackgroundComponent {
  @Input() leftBackgroundVisible = false;
}
