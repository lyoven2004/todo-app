export type TPaginationResult<T> = {
  page: number;
  total:number;
  totalPage: number;
  data: T[];
};