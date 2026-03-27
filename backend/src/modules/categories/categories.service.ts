import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TCategory } from './entities/category.entity';
import type { ICategoryRepository, TCreateCategoryInput } from './repositories/category.repository';
import { CATEGORY_REPOSITORY } from './repositories/category-token';
import { normalizeName } from 'src/common/utils/normalize.util';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private categoryRepository: ICategoryRepository
  ) { }

  async create(dto: CreateCategoryDto, userId: string): Promise<TCategory> {
    const { name } = dto;

    const normalizedName = normalizeName(name);

    const existing = await this.categoryRepository.findByNameAndUserId(normalizedName, userId)

    if (existing) {
      throw new ConflictException(normalizedName + ' already exists')
    }

    const data: TCreateCategoryInput = {
      name: normalizedName
    }
    return this.categoryRepository.create(data, userId);
  }

  async findAll(userId: string, query: QueryCategoryDto) {
    return this.categoryRepository.findAllByUserId(userId, query);
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    const task = await this.categoryRepository.findByIdAndUserId(id, userId);

    if (!task) {
      throw new NotFoundException('Category not found');
    }

    try {
      await this.categoryRepository.delete(id);

      return {
        message: 'Category deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException('Delete failed');
    }
  }
}
