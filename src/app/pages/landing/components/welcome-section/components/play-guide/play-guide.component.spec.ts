import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGuideComponent } from './play-guide.component';

describe('PlayGuideComponent', () => {
  let component: PlayGuideComponent;
  let fixture: ComponentFixture<PlayGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
