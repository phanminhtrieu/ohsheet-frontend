export interface MusicSheet {
    id: number;
    userId: string;
    title: string;
    parentId?: number;
    description?: string;
    transcriptionId: string;
    status: number;
    musicSheetVisibility: number;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isForked: boolean;
    createdDate: string;
    modifiedDate: string;
    likes?: any[];
    // Additional fields for display
    thumbnail?: string;
    thumbnailUrl?: string;
    uploaderName?: string;
    uploaderUsername?: string;
    uploaderAvatar?: string;
    uploaderAvatarUrl?: string;
    musicSheetUIState?: {
        isLiked: boolean;
    };
    tags?: string[];
}

export interface MusicSheetPagingRequest {
    pageIndex?: number;
    pageSize?: number;
    searchBy?: string;
    textSearch?: string;
    orderCol?: string;
    orderDir?: string;
    languageId?: number;
}
