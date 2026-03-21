import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  create(@Body() dto: CreateTaskDto,
    @CurrentUser('sub') userId: string) {
    return this.tasksService.create(dto, userId);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string) {
    return this.tasksService.delete(id, userId);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }
}
