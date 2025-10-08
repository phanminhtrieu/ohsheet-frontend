import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { StepperModule } from 'primeng/stepper';
import { SheetRendererComponent } from 'app/shared/components/sheet-renderer/sheet-renderer.component';

interface UploadedFile {
  name: string;
  size: number;
}

@Component({
  selector: 'app-upload-audio-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    DialogModule, 
    FileUploadModule,
    ButtonModule,
    ProgressBarModule,
    StepperModule,
    SheetRendererComponent
  ],
  templateUrl: './upload-audio-dialog.component.html',
  styleUrl: './upload-audio-dialog.component.scss'
})
export class UploadAudioDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  private intervalId: any;

  progressBarVisible = false;

  buttonUploadDisable = true;
  buttonUploadLoading = false;

  buttonNextToStepTwoDisable = false; //////////////

  uploadedFiles: any[] = [];
  firstFileUploaded: any;

  constructor() {  }

  ngOnInit() {  }

  uploadProgress: number = 0;

  startFakeProgress(duration: number = 2000) {
    this.uploadProgress = 0;
    this.buttonUploadLoading = true;

    const stepTime = 50;
    const steps = duration / stepTime;
    const increment = 100 / steps;
  
    this.intervalId = setInterval(() => {
      if (this.uploadProgress < 80) {
        this.uploadProgress += increment;
      } else {
        clearInterval(this.intervalId);
      }
    }, stepTime);
  }

  onUpload(event: FileUploadEvent) {
    console.log('File Uploaded ', event.files);

    this.uploadedFiles = event.files;
    this.setFirstFileUploaded(this.uploadedFiles)

    console.log("🍺 ", this.firstFileUploaded);
    this.buttonUploadLoading = false;
    this.buttonNextToStepTwoDisable = false;
  }

  onProgress(event: any) {
    this.uploadProgress = Math.round((event.originalEvent.loaded / event.originalEvent.total) * 100);
    // this.uploadProgress = event.progress;
  }

  onSelect(event: any) {
    this.buttonUploadDisable = false;
  }

  onClear(event: any) {
    this.buttonUploadDisable = true;
  }

  setFirstFileUploaded(array: any[]) {
    this.firstFileUploaded = array[0]
  }
}
