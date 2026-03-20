import { TCategory } from '../entities/category.entity';

export type TCreateCategoryInput = {
    name: string;
    userId: string;
};

export interface ICategoryRepository {
    create(data: TCreateCategoryInput): Promise<TCategory>;
    findByIdAndUserId(id: string, userId: string)
        : Promise<TCategory | null>;
}