import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';

import { SheetRendererComponent } from 'app/shared/components/sheet-renderer/sheet-renderer.component';
import { MusicSheetTranscriptionService } from 'app/core/services/music-sheet-transcription.service';
import { MusicSheetService } from 'app/core/services/music-sheet.service';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { finalize } from 'rxjs';
import { LocalHostConstant } from 'app/shared/constants';

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
    SheetRendererComponent,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './upload-audio-dialog.component.html',
  styleUrl: './upload-audio-dialog.component.scss'
})
export class UploadAudioDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @ViewChild('fu') fileUpload!: FileUpload;

  private intervalId: any;

  progressBarVisible = false;

  buttonUploadDisable = true;
  buttonUploadLoading = false;

  buttonNextToStepTwoDisable = true;

  uploadedFiles: any[] = [];
  firstFileUploaded: any;

  constructor(
    private musicSheetTranscriptionService: MusicSheetTranscriptionService,
    private musicSheetService: MusicSheetService,
    private localStorageService: LocalStorageService
  ) { }

  uploadProgress: number = 0;

  ngOnInit() { }

  startFakeProgress(duration: number = 2000) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

  onUpload(event: any) {
    // This is for custom upload, event.files contains the files to upload
    const file = event.files[0];
    if (!file) return;

    this.buttonUploadLoading = true;
    this.startFakeProgress(); // Keep fake progress for visual feedback while real request happens

    this.musicSheetTranscriptionService.transcribe(file)
      .pipe(
        finalize(() => {
          this.buttonUploadLoading = false;
          this.uploadProgress = 100; // Ensure progress is 100% on completion
          clearInterval(this.intervalId);
        })
      )
      .subscribe({
        next: (response) => {
          if (response.isSucceeded) {
            this.uploadedFiles = [file];
            this.setFirstFileUploaded(this.uploadedFiles);
            this.buttonNextToStepTwoDisable = false;
          }
        }
      });
  }

  onProgress(event: any) {
    this.uploadProgress = Math.round((event.originalEvent.loaded / event.originalEvent.total) * 100);
  }

  onSelect(event: any) {
    this.buttonUploadDisable = false;
  }

  onClear(event: any) {
    this.resetState();
  }

  onRemoveFile() {
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
    this.resetState();
  }

  setFirstFileUploaded(array: any[]) {
    this.firstFileUploaded = array[0]
  }

  showSaveDialog = false;
  title: string = '';
  description: string = '';

  openSaveDialog() {
    this.showSaveDialog = true;
  }

  onSave() {
    const userId = this.localStorageService.getItem(LocalHostConstant.USER).id;
    const transcriptionId = this.localStorageService.getItem(LocalHostConstant.TRANSCRIPTION_ID);

    if (transcriptionId) {
      this.musicSheetService.createMusicSheet(userId, this.title, this.description, transcriptionId)
        .subscribe({
          next: (res) => {
            this.showSaveDialog = false;
            this.visible = false;
            this.resetState();
          },
          error: (err) => {
            console.error('Error saving music sheet', err);
          }
        });
    }
  }

  private resetState() {
    this.buttonUploadDisable = true;
    this.uploadedFiles = [];
    this.firstFileUploaded = null;
    this.localStorageService.removeItem(LocalHostConstant.TRANSCRIPTION_ID);
    this.buttonNextToStepTwoDisable = true;
    this.uploadProgress = 0;
    clearInterval(this.intervalId);
  }
}
