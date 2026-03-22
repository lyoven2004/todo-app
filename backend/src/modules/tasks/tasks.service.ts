import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../categories/repositories/category-token';
import type { ICategoryRepository } from '../categories/repositories/category.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskPriority, TaskStatus, TTask } from './entities/task.entity';
import { TASK_REPOSITORY } from './repositories/task-token';
import type { ITaskRepository, TCreateTaskInput, TUpdateTaskInput } from './repositories/task.repository';
import { QueryTasksDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private taskRepository: ITaskRepository,
    @Inject(CATEGORY_REPOSITORY)
    private categoryRepository: ICategoryRepository
  ) { }

  async create(dto: CreateTaskDto, userId: string): Promise<TTask> {

    if (dto.categoryId) {

      const category = await this.categoryRepository.findByIdAndUserId(
        dto.categoryId,
        userId,
      );

      if (!category) {
        throw new NotFoundException('Invalid category');
      }
    }

    const data: TCreateTaskInput = {
      title: dto.title.trim(),
      description: dto.description?.trim() ?? null,
      status: dto.status ?? TaskStatus.NOT_STARTED,
      priority: dto.priority ?? TaskPriority.LOW,
      categoryId: dto.categoryId ?? null,
      expiredAt: dto.expiredAt ? new Date(dto.expiredAt) : null,
    };

    return this.taskRepository.create(userId, data);
  }

  async findAll(userId: string, query: QueryTasksDto) {
    return this.taskRepository.findAllByUserId(userId, query);
  }

  async findOne(id: string, userId: string): Promise<TTask> {
    const task = await this.taskRepository.findByIdAndUserId(id, userId);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto)
    : Promise<TTask> {

    if (dto.categoryId !== undefined && dto.categoryId !== null) {
      const category = await this.categoryRepository.findByIdAndUserId(
        dto.categoryId,
        userId,
      );

      if (!category) {
        throw new NotFoundException('Invalid category');
      }
    }

    const updateData: TUpdateTaskInput = {
      ...dto,
      title: dto.title?.trim(),
      description: dto.description?.trim(),
      expiredAt: dto.expiredAt ? new Date(dto.expiredAt) : undefined,
    };

    return this.taskRepository.update(id, userId, updateData);
  }

  async delete(taskId: string, userId: string): Promise<{ message: string }> {
    const task = await this.taskRepository.findByIdAndUserId(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    try {
      await this.taskRepository.delete(taskId);

      return {
        message: 'Task deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException('Delete failed');
    }
  }
}
