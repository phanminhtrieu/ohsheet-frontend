import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicSheetService } from 'app/core/services/music-sheet.service';
import { MusicSheet, MusicSheetPagingRequest } from 'app/core/models/music-sheet.interface';
import { DataTablePagedResult } from 'app/core/models/pagination.interface';
import { BehaviorSubject, Subject, Subscription, switchMap, tap } from 'rxjs';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { MusicSheetCardComponent } from './components/music-sheet-card/music-sheet-card.component';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-music-sheet-list',
    standalone: true,
    imports: [
        CommonModule,
        SearchInputComponent,
        MusicSheetCardComponent,
        PaginatorModule,
        ProgressSpinnerModule
    ],
    templateUrl: './music-sheet-list.component.html',
    styleUrl: './music-sheet-list.component.scss'
})
export class MusicSheetListComponent implements OnInit, OnDestroy {
    public musicSheets$ = new BehaviorSubject<MusicSheet[]>([]);
    public totalRecords$ = new BehaviorSubject<number>(0);
    public isLoading$ = new BehaviorSubject<boolean>(true);

    private filterChange$ = new Subject<MusicSheetPagingRequest>();
    private unsubscribe: Subscription[] = [];

    public filters: MusicSheetPagingRequest & { pageIndex: number; pageSize: number } = {
        pageIndex: 1,
        pageSize: 10,
        textSearch: '',
        searchBy: undefined
    };

    constructor(
        private readonly musicSheetService: MusicSheetService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        // Subscribe to filter changes and fetch data only on browser
        if (isPlatformBrowser(this.platformId)) {
            const subscription = this.filterChange$.pipe(
                switchMap(filters => this.fetchMusicSheets(filters))
            ).subscribe();
            this.unsubscribe.push(subscription);
        }

        // Subscribe to query param changes for navigation
        const queryParamSub = this.route.queryParams.subscribe(params => {
            const newSearch = params['search'] || '';

            // Update filters if search changed
            if (newSearch !== this.filters.textSearch) {
                this.filters.textSearch = newSearch;
                this.filters.searchBy = newSearch ? 'Title' : undefined;
                this.filters.pageIndex = 1;
            }

            // Trigger fetch (this will handle initial load too)
            this.filterChange$.next({ ...this.filters });
        });

        this.unsubscribe.push(queryParamSub);
    }

    ngOnDestroy(): void {
        this.unsubscribe.forEach((sub) => sub.unsubscribe());
    }

    private fetchMusicSheets(filters: MusicSheetPagingRequest) {
        this.isLoading$.next(true);

        return this.musicSheetService.getMusicSheets(filters).pipe(
            tap((response) => {
                if (response.isSucceeded && response.resultObj) {
                    const result: DataTablePagedResult<MusicSheet> = response.resultObj;
                    this.musicSheets$.next(result.items);
                    this.totalRecords$.next(result.totalRecords);
                }
                this.isLoading$.next(false);
            })
        );
    }

    public onSearchChange(keyword: string): void {
        this.filters.textSearch = keyword;
        this.filters.searchBy = keyword ? 'Title' : undefined;
        this.filters.pageIndex = 1; // Reset to first page on search

        // Update URL query params
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { search: keyword || null },
            queryParamsHandling: 'merge'
        });
    }

    public onPageChange(event: any): void {
        this.filters.pageIndex = event.page + 1; // PrimeNG paginator is 0-indexed
        this.filters.pageSize = event.rows;

        this.filterChange$.next({ ...this.filters });
    }
}
