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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
