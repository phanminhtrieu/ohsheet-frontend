import { Component } from '@angular/core';
import { TopbarComponent } from 'app/shared/components/topbar/topbar.component';
import { FeatureSectionComponent } from '../../components/feature-section/feature-section.component';
import { WelcomeSectionComponent } from '../../components/welcome-section/welcome-section.component';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-landing-list',
  standalone: true,
  imports: [
    TopbarComponent, 
    FeatureSectionComponent, 
    WelcomeSectionComponent, 
    ScrollTopModule,
  ],
  templateUrl: './landing-list.component.html',
  styleUrl: './landing-list.component.scss'
})
export class LandingListComponent {

  scrollToSection(sectionId: string) {
    const target = document.getElementById(sectionId);
    if (!target) return;
  
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start: number | null = null;
  
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      window.scrollTo(0, startPosition + distance * percent);
      if (progress < duration) requestAnimationFrame(step);
    };
  
    requestAnimationFrame(step);
  }

}
