import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecentlyViewedService } from 'app/core/services/recently-viewed.service';
import { MusicSheetCardComponent } from '../../../music-sheet-list/components/music-sheet-card/music-sheet-card.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-recently-viewed',
    standalone: true,
    imports: [CommonModule, RouterModule, MusicSheetCardComponent, ProgressSpinnerModule],
    templateUrl: './recently-viewed.component.html',
    styleUrls: ['./recently-viewed.component.scss']
})
export class RecentlyViewedComponent implements OnInit {
    items: any[] = [];
    isLoading = true;

    constructor(private recentlyViewedService: RecentlyViewedService) { }

    ngOnInit() {
        this.isLoading = true;
        this.recentlyViewedService.getRecentlyViewed(20).subscribe({
            next: (res) => {
                if (res && res.length > 0) {
                    this.items = res;
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }
}
