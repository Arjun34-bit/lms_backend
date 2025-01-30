export type ApiResponseT = {
  data: object | null;
  message: string;
  error: object | null;
};

export type ApiPaginationResponseT = {
  data: object | null;
  pagination: {
    totalCount: number;
    totalPages?: number;
    limit?: number;
  };
  message: string;
  error: object | null;
}

export type PaginationT = {
  data: object | null;
  totalCount: number;
}