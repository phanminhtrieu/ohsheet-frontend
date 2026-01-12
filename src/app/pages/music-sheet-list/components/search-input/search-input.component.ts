import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-search-input',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule],
    templateUrl: './search-input.component.html',
    styleUrl: './search-input.component.scss'
})
export class SearchInputComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() initialValue: string = '';
    @Input() autoFocus: boolean = false;
    @Output() searchChange = new EventEmitter<string>();
    @ViewChild('input') inputElement!: ElementRef;

    searchValue: string = '';
    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.searchValue = this.initialValue;

        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(value => {
            this.searchChange.emit(value);
        });
    }

    ngOnChanges(): void {
        this.searchValue = this.initialValue;
    }

    ngAfterViewInit(): void {
        if (this.autoFocus) {
            // Small timeout to ensure DOM is ready and transition is complete
            setTimeout(() => {
                this.inputElement.nativeElement.focus();
            }, 100);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onInputChange(): void {
        this.searchSubject.next(this.searchValue);
    }
}
