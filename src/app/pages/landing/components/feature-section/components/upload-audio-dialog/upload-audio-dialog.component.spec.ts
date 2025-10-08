import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAudioDialogComponent } from './upload-audio-dialog.component';

describe('UploadAudioDialogComponent', () => {
  let component: UploadAudioDialogComponent;
  let fixture: ComponentFixture<UploadAudioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAudioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAudioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
