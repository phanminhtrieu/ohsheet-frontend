import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from 'app/core/models/comment.interface';
import { CommentItemComponent } from '../comment-item/comment-item.component';

@Component({
    selector: 'app-comment-list',
    standalone: true,
    imports: [CommonModule, CommentItemComponent],
    template: `
        <div class="comment-list">
            <div *ngIf="comments.length === 0" class="text-center py-8 text-gray-500">
                <i class="pi pi-comments text-4xl mb-2 block"></i>
                <p>No comments yet. Be the first to comment!</p>
            </div>
            
            <app-comment-item 
                *ngFor="let comment of comments" 
                [comment]="comment" 
                [currentUserId]="currentUserId"
                (reply)="onReply($event)"
                (delete)="onDelete($event)">
            </app-comment-item>
        </div>
    `
})
export class CommentListComponent {
    @Input() comments: Comment[] = [];
    @Input() currentUserId: string | null = null;

    @Output() reply = new EventEmitter<{ content: string, parentId: number }>();
    @Output() delete = new EventEmitter<number>();

    onReply(event: { content: string, parentId: number }) {
        this.reply.emit(event);
    }

    onDelete(commentId: number) {
        this.delete.emit(commentId);
    }
}
