import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VexflowMidiPlayerComponent } from './vexflow-midi-player.component';

describe('VexflowMidiPlayerComponent', () => {
  let component: VexflowMidiPlayerComponent;
  let fixture: ComponentFixture<VexflowMidiPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VexflowMidiPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VexflowMidiPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
