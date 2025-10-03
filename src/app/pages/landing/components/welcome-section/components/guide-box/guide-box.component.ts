import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-guide-box',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
  templateUrl: './guide-box.component.html',
  styleUrl: './guide-box.component.scss'
})
export class GuideBoxComponent {
  @Input() guideBoxVisible = false;
  @Input() images: { src: string; alt: string; title?: string }[] = [];
  @Input() pointerGuideBoxVisible = false;
  @Input() hideGuideBoxPointer = false;

  @Output() showRightBackground = new EventEmitter<void>();
}
