export type TPaginationResult<T> = {
  page: number;
  totalPage: number;
  data: T[];
};