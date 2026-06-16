export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ApiSuccess<T> = { success: true; data: T };
export type ApiSuccessVoid = { success: true };
export type ApiError = {
  success: false;
  data: unknown;
  status: number;
};
export type ApiResult<T> = ApiSuccess<T> | ApiSuccessVoid | ApiError;
