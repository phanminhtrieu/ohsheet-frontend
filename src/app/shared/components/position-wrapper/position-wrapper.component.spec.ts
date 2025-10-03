import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionWrapperComponent } from './position-wrapper.component';

describe('PositionWrapperComponent', () => {
  let component: PositionWrapperComponent;
  let fixture: ComponentFixture<PositionWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
