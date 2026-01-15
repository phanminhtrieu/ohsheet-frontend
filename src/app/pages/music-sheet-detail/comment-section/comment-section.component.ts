import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from 'app/core/services/comment.service';
import { Comment, CreateCommentRequest } from 'app/core/models/comment.interface';
import { CommentListComponent } from './comment-list/comment-list.component';
import { ButtonModule } from 'primeng/button';
import { InputTextarea } from 'primeng/inputtextarea';
import { NotificationService } from 'app/core/services/notification.service';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { LocalHostConstant } from 'app/shared/constants';

@Component({
    selector: 'app-comment-section',
    standalone: true,
    imports: [CommonModule, FormsModule, CommentListComponent, ButtonModule, InputTextarea],
    template: `
        <div class="comment-section mt-8 pt-8 border-t border-gray-200">
            <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
                Comments
                <span class="text-sm font-normal text-gray-500">({{ totalComments }})</span>
            </h3>

            <!-- Main Comment Input -->
            <div class="main-comment-input mb-8">
                <div *ngIf="!currentUserId" class="bg-blue-50 p-4 rounded-lg text-blue-700 text-sm mb-4">
                    Please <a href="/auth/sign-in" class="font-bold underline">sign in</a> to join the conversation.
                </div>
                
                <div class="flex gap-3">
                    <div class="flex-1">
                        <textarea 
                            pInputTextarea 
                            [(ngModel)]="newCommentContent" 
                            placeholder="What are your thoughts on this sheet?" 
                            class="w-full"
                            [rows]="3"
                            [autoResize]="true"
                            [disabled]="!currentUserId">
                        </textarea>
                        <div class="flex justify-end mt-2">
                            <button 
                                pButton 
                                type="button" 
                                label="Post Comment" 
                                [disabled]="!newCommentContent.trim() || !currentUserId || isSubmitting"
                                [loading]="isSubmitting"
                                (click)="postComment()">
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Comment List -->
            <app-comment-list 
                [comments]="comments" 
                [currentUserId]="currentUserId"
                (reply)="onReply($event)"
                (delete)="onDelete($event)">
            </app-comment-list>
        </div>
    `
})
export class CommentSectionComponent implements OnInit {
    @Input() sheetId!: number;

    comments: Comment[] = [];
    totalComments = 0;
    newCommentContent = '';
    currentUserId: string | null = null;
    isSubmitting = false;

    constructor(
        private commentService: CommentService,
        private notificationService: NotificationService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit(): void {
        const user = this.localStorageService.getItem(LocalHostConstant.USER);
        if (user) {
            this.currentUserId = user.id;
        }
        this.loadComments();
    }

    loadComments() {
        this.commentService.getComments(this.sheetId).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this.comments = res.resultObj;
                    this.calculateTotalComments(this.comments);
                }
            }
        });
    }

    calculateTotalComments(comments: Comment[]) {
        let count = comments.length;
        comments.forEach(c => {
            if (c.replies) {
                count += this.getRepliesCount(c.replies);
            }
        });
        this.totalComments = count;
    }

    getRepliesCount(replies: Comment[]): number {
        let count = replies.length;
        replies.forEach(r => {
            if (r.replies) {
                count += this.getRepliesCount(r.replies);
            }
        });
        return count;
    }

    postComment() {
        if (!this.newCommentContent.trim()) return;

        this.isSubmitting = true;
        this.commentService.createComment(this.sheetId, this.newCommentContent).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this.newCommentContent = '';
                    this.loadComments();
                    this.notificationService.showSuccessNotificatoin('Comment posted successfully');
                }
                this.isSubmitting = false;
            },
            error: () => {
                this.isSubmitting = false;
            }
        });
    }

    onReply(event: { content: string, parentId: number }) {
        if (!this.currentUserId) {
            this.notificationService.showInfoNotificatoin('Please log in to reply.');
            return;
        }

        this.commentService.createComment(this.sheetId, event.content, event.parentId).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this.loadComments();
                    this.notificationService.showSuccessNotificatoin('Reply posted successfully');
                }
            }
        });
    }

    onDelete(commentId: number) {
        this.commentService.deleteComment(this.sheetId, commentId).subscribe({
            next: (res) => {
                if (res.isSucceeded) {
                    this.loadComments();
                    this.notificationService.showSuccessNotificatoin('Comment deleted');
                }
            }
        });
    }
}
