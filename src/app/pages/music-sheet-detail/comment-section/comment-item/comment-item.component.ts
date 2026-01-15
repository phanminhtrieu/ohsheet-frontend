import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from 'app/core/models/comment.interface';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextarea } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-comment-item',
    standalone: true,
    imports: [CommonModule, Avatar, ButtonModule, InputTextarea, FormsModule],
    template: `
        <div class="comment-item mb-4" [class.reply-item]="isReply">
            <div class="flex gap-3">
                <p-avatar 
                    [image]="comment.userAvatar || defaultAvatar" 
                    shape="circle" 
                    size="normal"
                    (onImageError)="onImageError($event)">
                </p-avatar>
                
                <div class="flex-1">
                    <div class="comment-bubble p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-semibold text-sm text-gray-900">{{ comment.userName }}</span>
                            <span class="text-xs text-gray-500">{{ comment.createdAt | date:'short' }}</span>
                        </div>
                        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
                    </div>
                    
                    <div class="comment-actions mt-1 flex gap-3 text-xs">
                        <button pButton type="button" label="Reply" class="p-button-link p-0 h-auto text-primary" (click)="toggleReply()"></button>
                        <button *ngIf="canDelete" pButton type="button" label="Delete" class="p-button-link p-0 h-auto text-red-500" (click)="onDelete()"></button>
                    </div>

                    <!-- Reply Input -->
                    <div *ngIf="comment.isReplying" class="reply-input mt-3">
                        <textarea 
                            pInputTextarea 
                            [(ngModel)]="replyContent" 
                            placeholder="Write a reply..." 
                            class="w-full text-sm"
                            [rows]="2"
                            [autoResize]="true">
                        </textarea>
                        <div class="flex justify-end gap-2 mt-2">
                            <button pButton type="button" label="Cancel" class="p-button-text p-button-sm" (click)="toggleReply()"></button>
                            <button pButton type="button" label="Post Reply" class="p-button-sm" [disabled]="!replyContent.trim()" (click)="postReply()"></button>
                        </div>
                    </div>

                    <!-- Nested Replies -->
                    <div *ngIf="comment.replies && comment.replies.length > 0" class="replies-container mt-4 border-l-2 border-gray-100 pl-4">
                        <app-comment-item 
                            *ngFor="let reply of comment.replies" 
                            [comment]="reply" 
                            [currentUserId]="currentUserId"
                            [isReply]="true"
                            (reply)="onNestedReply($event)"
                            (delete)="onNestedDelete($event)">
                        </app-comment-item>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .comment-bubble {
            position: relative;
        }
        .reply-item {
            /* Additional styling for replies if needed */
        }
        :host ::ng-deep .p-button-link {
            text-decoration: none;
            font-weight: 500;
            &:hover {
                text-decoration: underline;
            }
        }
    `]
})
export class CommentItemComponent {
    @Input() comment!: Comment;
    @Input() currentUserId: string | null = null;
    @Input() isReply = false;

    @Output() reply = new EventEmitter<{ content: string, parentId: number }>();
    @Output() delete = new EventEmitter<number>();

    replyContent = '';
    defaultAvatar = 'assets/icons/user.svg'; // Using a more likely existing icon or fallback below
    private isUsingFallback = false;

    get canDelete(): boolean {
        return this.currentUserId === this.comment.userId;
    }

    toggleReply() {
        this.comment.isReplying = !this.comment.isReplying;
        if (!this.comment.isReplying) {
            this.replyContent = '';
        }
    }

    postReply() {
        if (this.replyContent.trim()) {
            this.reply.emit({ content: this.replyContent, parentId: this.comment.id });
            this.replyContent = '';
            this.comment.isReplying = false;
        }
    }

    onDelete() {
        this.delete.emit(this.comment.id);
    }

    onNestedReply(event: { content: string, parentId: number }) {
        this.reply.emit(event);
    }

    onNestedDelete(commentId: number) {
        this.delete.emit(commentId);
    }

    onImageError(event: any) {
        if (!this.isUsingFallback) {
            this.isUsingFallback = true;
            // Try a generic icon or a data URI if the first fallback fails
            event.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
        } else {
            // If even the fallback fails, stop trying to load images to prevent infinite loop
            event.target.src = '';
            event.target.style.display = 'none';
        }
    }
}
