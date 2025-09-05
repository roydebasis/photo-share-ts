export interface Params {
  page: number;
  limit: number;
  sort: string;
  order: "asc" | "desc";
  search?: string;
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
