import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProfileService } from 'app/core/services/profile.service';
import { TabViewModule } from 'primeng/tabview';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { ProfileLikesComponent } from './components/profile-likes/profile-likes.component';
import { ProfileMySheetsComponent } from './components/profile-my-sheets/profile-my-sheets.component';
import { RecentlyViewedComponent } from './components/recently-viewed/recently-viewed.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        CommonModule,
        TabViewModule,
        ProfileEditComponent,
        ProfileLikesComponent,
        ProfileMySheetsComponent,
        ProgressSpinnerModule,
        RecentlyViewedComponent
    ],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
    public profile: any;
    public isLoading = true;
    public activeTabIndex = 0;

    constructor(
        private profileService: ProfileService,
        private route: ActivatedRoute,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.loadProfile();
        }

        this.route.queryParams.subscribe(params => {
            if (params['tab']) {
                this.activeTabIndex = parseInt(params['tab'], 10);
            }
        });
    }

    loadProfile(): void {
        this.isLoading = true;
        this.profileService.getMyProfile().subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this.profile = res.resultObj;
                }
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    onProfileUpdated(): void {
        this.loadProfile();
    }
}
