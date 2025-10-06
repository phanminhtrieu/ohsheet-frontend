import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PositionWrapperComponent } from 'app/shared/components/position-wrapper/position-wrapper.component';

@Component({
  selector: 'app-play-guide',
  standalone: true,
  imports: [CommonModule, PositionWrapperComponent],
  templateUrl: './play-guide.component.html',
  styleUrls: ['./play-guide.component.scss']
})
export class PlayGuideComponent {
  @Input() visible = true;
  
  @Output() playClicked = new EventEmitter<void>();
  @Output() scrollToFeature = new EventEmitter<void>();

}
