import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { TCategory } from './entities/category.entity';
import type { ICategoryRepository, TCreateCategoryInput } from './repositories/category.repository';
import { CATEGORY_REPOSITORY } from './repositories/category-token';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private categoryRepository: ICategoryRepository
  ) { }

  async create(dto: CreateCategoryDto, userId: string): Promise<TCategory> {
    const { name } = dto;

    const existing = await this.categoryRepository.findByNameAndUserId(name, userId)

    if (existing) {
      throw new ConflictException('Category name already exists')
    }

    const data: TCreateCategoryInput = {
      name: dto.name.trim().charAt(0).toUpperCase() + dto.name.trim().slice(1)
    }
    return this.categoryRepository.create(data, userId);
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
