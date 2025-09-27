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
    responseType?: 'json';
    withCredentials?: boolean;
}

export enum Endpoints {
    TEST = '/auth/profile',
}