export interface DataTablePagedResult<T> {
    items: T[];
    pageIndex: number;
    pageSize: number;
    totalRecords: number;
    pageCount?: number;
}

export interface PagingRequest {
    pageIndex?: number;
    pageSize?: number;
    searchBy?: string;
    textSearch?: string;
    orderCol?: string;
    orderDir?: string;
    languageId?: number;
}
