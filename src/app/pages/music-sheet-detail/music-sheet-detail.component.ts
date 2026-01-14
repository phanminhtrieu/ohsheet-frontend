import { CommonModule, Location } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'app/core/base/base.component';
import { MusicSheet } from 'app/core/models/music-sheet.interface';
import { MusicSheetService } from 'app/core/services/music-sheet.service';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { NotificationService } from 'app/core/services/notification.service';
import { LocalHostConstant } from 'app/shared/constants';
import { RecentlyViewedService } from 'app/core/services/recently-viewed.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-music-sheet-detail',
    standalone: true,
    imports: [CommonModule, ButtonModule, ProgressSpinnerModule],
    templateUrl: './music-sheet-detail.component.html',
    styleUrl: './music-sheet-detail.component.scss'
})
export class MusicSheetDetailComponent extends BaseComponent implements OnInit {
    musicSheet: MusicSheet | null = null;
    isLoading = true;
    isLiked: boolean = false;
    currentUserId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private musicSheetService: MusicSheetService,
        private location: Location,
        @Inject(PLATFORM_ID) protected override platformId: Object,
        private localStorageService: LocalStorageService,
        private notificationService: NotificationService,
        private recentlyViewedService: RecentlyViewedService
    ) {
        super(platformId);
    }

    ngOnInit(): void {
        if (this.isBrowser) {
            const user = this.localStorageService.getItem(LocalHostConstant.USER);
            if (user) {
                this.currentUserId = user.id;
            }

            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
                this.loadMusicSheet(Number(id));
                if (this.currentUserId) {
                    this.recentlyViewedService.recordView(Number(id)).subscribe();
                }
            }
        }
    }

    loadMusicSheet(id: number): void {
        this.isLoading = true;
        this.musicSheetService.getMusicSheetById(id)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (response) => {
                    if (response.isSucceeded) {
                        this.musicSheet = response.resultObj;
                        if (this.musicSheet?.musicSheetUIState) {
                            this.isLiked = this.musicSheet.musicSheetUIState.isLiked;
                        }
                    }
                },
                error: (err) => {
                    console.error('Failed to load music sheet', err);
                }
            });
    }

    toggleLike() {
        console.log('toggleLike called', { currentUserId: this.currentUserId, isLiked: this.isLiked });
        if (!this.currentUserId) {
            this.notificationService.showInfoNotificatoin('Please log in to like this music sheet.', 'Login Required');
            return;
        }

        if (this.isLiked) {
            this.musicSheetService.unlikeMusicSheet(this.musicSheet!.id).subscribe({
                next: (res) => {
                    if (res.isSucceeded) {
                        this.isLiked = false;
                        this.musicSheet!.likeCount--;
                    }
                }
            });
        } else {
            this.musicSheetService.likeMusicSheet(this.musicSheet!.id).subscribe({
                next: (res) => {
                    if (res.isSucceeded) {
                        this.isLiked = true;
                        this.musicSheet!.likeCount++;
                    }
                }
            });
        }
    }

    goBack(): void {
        this.location.back();
    }

    formatDate(dateString: string): string {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    onImageError(event: Event, isAvatar: boolean = false): void {
        const img = event.target as HTMLImageElement;
        if (isAvatar) {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23e5e7eb"/%3E%3Cpath d="M16 16a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z" fill="%239ca3af"/%3E%3C/svg%3E';
        } else {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23e5e7eb"/%3E%3Cpath d="M50 150l50-50 30 30 20-20v40H50z" fill="%239ca3af"/%3E%3Ccircle cx="70" cy="70" r="15" fill="%239ca3af"/%3E%3C/svg%3E';
        }
    }
}
