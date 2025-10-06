import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeBoxComponent } from './welcome-box.component';

describe('WelcomeBoxComponent', () => {
  let component: WelcomeBoxComponent;
  let fixture: ComponentFixture<WelcomeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
