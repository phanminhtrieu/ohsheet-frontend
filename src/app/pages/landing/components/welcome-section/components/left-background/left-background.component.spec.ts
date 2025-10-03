import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftBackgroundComponent } from './left-background.component';

describe('LeftBackgroundComponent', () => {
  let component: LeftBackgroundComponent;
  let fixture: ComponentFixture<LeftBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
