import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideBoxComponent } from './guide-box.component';

describe('GuideBoxComponent', () => {
  let component: GuideBoxComponent;
  let fixture: ComponentFixture<GuideBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuideBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
