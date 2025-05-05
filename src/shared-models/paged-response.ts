export interface PagedResponse<T> {
    data: T[];
    totalCount: number;
    page: number;
    elementsPerPage: number;
}