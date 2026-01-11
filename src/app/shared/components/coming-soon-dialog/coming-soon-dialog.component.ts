import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-coming-soon-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule],
    templateUrl: './coming-soon-dialog.component.html',
    styleUrl: './coming-soon-dialog.component.scss'
})
export class ComingSoonDialogComponent {
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() close = new EventEmitter<void>();

    updateVisibility(isVisible: boolean) {
        this.visible = isVisible;
        this.visibleChange.emit(isVisible);
        if (!isVisible) {
            this.close.emit();
        }
    }
}
