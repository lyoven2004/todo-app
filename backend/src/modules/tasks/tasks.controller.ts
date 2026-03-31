import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { QueryTasksDto } from './dto/query-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser('sub') userId: string) {
    return this.tasksService.create(dto, userId);
  }

  @Get()
  findAll(@Query() query: QueryTasksDto, @CurrentUser('sub') userId: string) {
    return this.tasksService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.tasksService.update(id, userId, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.tasksService.delete(id, userId);
  }
}
