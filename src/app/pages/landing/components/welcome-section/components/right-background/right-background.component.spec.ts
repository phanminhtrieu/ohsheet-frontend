import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightBackgroundComponent } from './right-background.component';

describe('RightBackgroundComponent', () => {
  let component: RightBackgroundComponent;
  let fixture: ComponentFixture<RightBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
