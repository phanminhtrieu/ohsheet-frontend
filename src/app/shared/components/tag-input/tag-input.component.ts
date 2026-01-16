import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipModule } from 'primeng/chip';
import { MusicSheetService } from 'app/core/services/music-sheet.service';

@Component({
    selector: 'app-tag-input',
    standalone: true,
    imports: [CommonModule, FormsModule, AutoCompleteModule, ChipModule],
    template: `
    <div class="flex flex-col gap-2">
        <p-autoComplete 
            [(ngModel)]="currentTag" 
            [suggestions]="suggestions" 
            (completeMethod)="searchTags($event)" 
            (onSelect)="addTag($event)"
            (keydown.enter)="addTag()"
            [placeholder]="placeholder"
            [forceSelection]="false"
            [minLength]="1"
            [delay]="300"
            [inputId]="inputId"
            styleClass="w-full"
            inputStyleClass="w-full"
            appendTo="body"
        ></p-autoComplete>
        <div class="flex flex-wrap gap-2 mt-2" *ngIf="tags.length > 0">
            <p-chip *ngFor="let tag of tags; let i = index" [label]="tag" [removable]="true" (onRemove)="removeTag(i)"></p-chip>
        </div>
    </div>
  `,
    styles: []
})
export class TagInputComponent {
    @Input() tags: string[] = [];
    @Output() tagsChange = new EventEmitter<string[]>();
    @Input() placeholder: string = 'Enter tag and press Enter';
    @Input() inputId: string = 'tags';

    currentTag: string = '';
    suggestions: string[] = [];

    constructor(private musicSheetService: MusicSheetService) { }

    searchTags(event: any) {
        this.musicSheetService.searchTags(event.query).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this.suggestions = res.resultObj;
                }
            }
        });
    }

    addTag(event?: any) {
        let tagToAdd = '';
        if (event && typeof event === 'string') { // AutoComplete selection might pass the string directly or an object depending on configuration, but here suggestions are strings
            tagToAdd = event;
        } else if (this.currentTag && typeof this.currentTag === 'string') {
            tagToAdd = this.currentTag;
        }

        if (tagToAdd && typeof tagToAdd === 'string' && tagToAdd.trim()) {
            const tag = tagToAdd.trim();
            if (!this.tags.includes(tag)) {
                this.tags.push(tag);
                this.tagsChange.emit(this.tags);
            }
            this.currentTag = '';
        }
    }

    removeTag(index: number) {
        this.tags.splice(index, 1);
        this.tagsChange.emit(this.tags);
    }
}
