import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from 'app/core/services/profile.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-profile-edit',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextarea,
        ButtonModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './profile-edit.component.html'
})
export class ProfileEditComponent implements OnInit {
    @Input() profile: any;
    @Output() updated = new EventEmitter<void>();

    public form!: FormGroup;
    public isSubmitting = false;
    public avatarPreview: string | null = null;
    public selectedFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            fullName: [this.profile?.fullName || '', [Validators.required, Validators.maxLength(100)]],
            bio: [this.profile?.bio || '', [Validators.maxLength(500)]]
        });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.avatarPreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        this.isSubmitting = true;
        const formData = new FormData();
        formData.append('fullName', this.form.get('fullName')?.value);
        formData.append('bio', this.form.get('bio')?.value);
        if (this.selectedFile) {
            formData.append('avatarFile', this.selectedFile);
        }

        this.profileService.updateMyProfile(formData).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully' });
                    this.updated.emit();
                    this.avatarPreview = null;
                    this.selectedFile = null;
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message || 'Failed to update profile' });
                }
                this.isSubmitting = false;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating profile' });
                this.isSubmitting = false;
            }
        });
    }
}
