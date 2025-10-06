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
    const container = document.querySelector('main');
    
    if (!target || !container) return;
  
    const targetPosition = target.offsetTop; 
    const startPosition = container.scrollTop;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start: number | null = null;
  
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      container.scrollTo({
        top: startPosition + distance * percent,
        behavior: "auto"
      });
      if (progress < duration) requestAnimationFrame(step);
    };
  
    requestAnimationFrame(step);
  }

}
