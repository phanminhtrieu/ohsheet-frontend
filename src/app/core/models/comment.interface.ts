export interface Comment {
    id: number;
    musicSheetId: number;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: string;
    parentId?: number;
    replies: Comment[];

    // UI state
    isReplying?: boolean;
    isEditing?: boolean;
}

export interface CreateCommentRequest {
    content: string;
    parentId?: number;
}
