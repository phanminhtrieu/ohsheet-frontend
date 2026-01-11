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

    ANONYMOUS_SUBSCRIPTION = '/AnonymousSubscription',

    // Music Transcription
    MUSIC_TRANSCRIPTION_TRANSCRIBE = '/MusicTranscription/transcribe',
    MUSIC_TRANSCRIPTION_GET_MIDI = '/MusicTranscription/:id/midi',

    // Music Sheet
    MUSIC_SHEET = '/MusicSheet',
}