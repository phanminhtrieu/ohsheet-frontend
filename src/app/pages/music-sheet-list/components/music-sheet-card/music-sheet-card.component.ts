import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MusicSheet } from 'app/core/models/music-sheet.interface';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-music-sheet-card',
    standalone: true,
    imports: [CommonModule, CardModule],
    templateUrl: './music-sheet-card.component.html',
    styleUrl: './music-sheet-card.component.scss'
})
export class MusicSheetCardComponent {
    @Input() musicSheet!: MusicSheet;

    get thumbnailUrl(): string {
        return this.musicSheet.thumbnail || this.musicSheet.thumbnailUrl || '';
    }

    get uploaderAvatar(): string {
        return this.musicSheet.uploaderAvatar || this.musicSheet.uploaderAvatarUrl || '';
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatCount(count: number): string {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }

    constructor(private router: Router) { }

    onImageError(event: Event, isAvatar: boolean = false): void {
        const img = event.target as HTMLImageElement;
        // Use inline SVG data URL to avoid additional HTTP requests for fallback images
        if (isAvatar) {
            // Simple avatar placeholder
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23e5e7eb"/%3E%3Cpath d="M16 16a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z" fill="%239ca3af"/%3E%3C/svg%3E';
        } else {
            // Simple image placeholder
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23e5e7eb"/%3E%3Cpath d="M50 150l50-50 30 30 20-20v40H50z" fill="%239ca3af"/%3E%3Ccircle cx="70" cy="70" r="15" fill="%239ca3af"/%3E%3C/svg%3E';
        }
    }

    navigateToDetail(): void {
        if (this.musicSheet && this.musicSheet.id) {
            this.router.navigate(['/music-sheets', this.musicSheet.id]);
        }
    }
}
