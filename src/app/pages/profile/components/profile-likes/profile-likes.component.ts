import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from 'app/core/services/profile.service';
import { MusicSheetCardComponent } from '../../../music-sheet-list/components/music-sheet-card/music-sheet-card.component';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MusicSheet } from 'app/core/models/music-sheet.interface';
import { PagingRequest } from 'app/core/models/pagination.interface';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-profile-likes',
    standalone: true,
    imports: [
        CommonModule,
        MusicSheetCardComponent,
        PaginatorModule,
        ProgressSpinnerModule,
        RouterModule
    ],
    templateUrl: './profile-likes.component.html'
})
export class ProfileLikesComponent implements OnInit {
    public likedSheets: MusicSheet[] = [];
    public totalRecords = 0;
    public isLoading = true;
    public filters: PagingRequest = {
        pageIndex: 1,
        pageSize: 8
    };

    constructor(private profileService: ProfileService) { }

    ngOnInit(): void {
        this.loadLikedSheets();
    }

    loadLikedSheets(): void {
        this.isLoading = true;
        this.profileService.getMyLikedSheets(this.filters).subscribe({
            next: (res) => {
                if (res.isSucceeded && res.resultObj) {
                    this.likedSheets = res.resultObj.items;
                    this.totalRecords = res.resultObj.totalRecords;
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    onPageChange(event: any): void {
        this.filters.pageIndex = event.page + 1;
        this.filters.pageSize = event.rows;
        this.loadLikedSheets();
    }
}
