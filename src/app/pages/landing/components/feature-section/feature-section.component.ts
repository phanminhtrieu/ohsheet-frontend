import { Component } from '@angular/core';

@Component({
  selector: 'app-feature-section',
  standalone: true,
  imports: [],
  templateUrl: './feature-section.component.html',
  styleUrl: './feature-section.component.scss'
})
export class FeatureSectionComponent {
  inputOptionsVisible = false;

  toggleImgInputOption() {
    this.inputOptionsVisible = !this.inputOptionsVisible;
  }
}
