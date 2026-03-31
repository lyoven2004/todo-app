import { TPaginationResult } from 'src/common/types/pagination.type';
import { TCategory } from '../entities/category.entity';

export type TCreateCategoryInput = {
  name: string;
};

export type TQueryCategory = {
  search?: string;
  page?: number;
  limit?: number;
};

export interface ICategoryRepository {
  create(data: TCreateCategoryInput, userId: string): Promise<TCategory>;
  findByIdAndUserId(id: string, userId: string): Promise<TCategory | null>;
  findByNameAndUserId(name: string, userId: string): Promise<TCategory | null>;
  findAllByUserId(
    userId: string,
    query: TQueryCategory,
  ): Promise<TPaginationResult<TCategory>>;
  delete(id: string): Promise<void>;
}
