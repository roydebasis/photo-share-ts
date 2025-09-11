export interface Params {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  search?: string;
}

/*
 * Interface for the result of the raw query, which returns a flat list of IDs.
 */
export interface RawQueryResult {
  id: number;
}

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_more: boolean;
    next_page?: number;
    previous_page?: number;
  };
}
