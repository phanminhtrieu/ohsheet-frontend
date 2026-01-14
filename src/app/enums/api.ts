import { HttpHeaders } from "@angular/common/http";
import { IObject } from "./common";

export enum Methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

export interface IApiOptions {
    params?: IObject;
    urlReplacements?: IObject;
    body?: any;
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    reportProgress?: boolean;
    observe?: 'events';
    responseType?: 'json' | 'arraybuffer';
    withCredentials?: boolean;
    skipSuccessNotification?: boolean;
}

export interface ApiResult {
    isSucceeded: boolean;
    message?: string;
    resultObj?: any;
}

export enum Endpoints {
    TEST = '/auth/profile',

    // Auth
    AUTH_SIGN_UP = '/Auth/sign-up',
    AUTH_SIGN_IN = '/Auth/sign-in',
    AUTH_LOGOUT = '/Auth/logout',

    ANONYMOUS_SUBSCRIPTION = '/AnonymousSubscription',

    // Music Transcription
    MUSIC_TRANSCRIPTION_TRANSCRIBE = '/MusicTranscription/transcribe',
    MUSIC_TRANSCRIPTION_GET_MIDI = '/MusicTranscription/:id/midi',

    // Music Sheet
    MUSIC_SHEET = '/MusicSheet',
    MUSIC_SHEET_PAGING = '/MusicSheet/paging',
    MUSIC_SHEET_DETAIL = '/MusicSheet/:id',
    MUSIC_SHEET_LIKE = '/MusicSheet/:id/like',

    // Profile
    PROFILE = '/Profile',
    PROFILE_ME = '/Profile/me',
    PROFILE_LIKES = '/Profile/me/likes',
}