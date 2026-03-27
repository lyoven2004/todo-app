import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { QueryCategoryDto } from './dto/query-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser('sub') userId: string) {
    return this.categoriesService.create(createCategoryDto, userId);
  }

  @Get()
  findAll(
    @Query() query: QueryCategoryDto,
    @CurrentUser('sub') userId: string
  ) {
    return this.categoriesService.findAll(userId, query);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string) {
    return this.categoriesService.delete(id, userId);
  }
}
