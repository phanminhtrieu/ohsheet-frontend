import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-position-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './position-wrapper.component.html',
  styleUrl: './position-wrapper.component.scss'
})
export class PositionWrapperComponent {
  @Input() top?: string;
  @Input() left?: string;
  @Input() right?: string;
  @Input() bottom?: string;
  @Input() zIndex?: string;
  @Input() centerX = false;
  @Input() centerY = false;

  getPositionStyle() {
    const style: any = {};
    if (this.top) style.top = this.top;
    if (this.left) style.left = this.left;
    if (this.right) style.right = this.right;
    if (this.bottom) style.bottom = this.bottom;
    if (this.zIndex) style.zIndex = this.zIndex;

    let transformX = '';
    let transformY = '';

    if (this.centerX) {
      style.left = '50%';
      transformX = '-50%';
    }
    if (this.centerY) {
      style.top = '50%';
      transformY = '-50%';
    }

    if (transformX || transformY) {
      style.transform = `translate(${transformX || 0}, ${transformY || 0})`;
    }

    return style;
  }
} 
