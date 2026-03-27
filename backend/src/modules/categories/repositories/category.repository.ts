import { TCategory } from '../entities/category.entity';

export type TCreateCategoryInput = {
    name: string;
};

export interface ICategoryRepository {
    create(data: TCreateCategoryInput, userId: string): Promise<TCategory>;
    findByIdAndUserId(id: string, userId: string)
        : Promise<TCategory | null>;
    findByNameAndUserId(name: string, userId: string)
        : Promise<TCategory | null>;
}