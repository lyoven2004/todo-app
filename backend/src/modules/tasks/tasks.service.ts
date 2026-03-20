import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../categories/repositories/category-token';
import type { ICategoryRepository } from '../categories/repositories/category.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskPriority, TaskStatus, TTask } from './entities/task.entity';
import { TASK_REPOSITORY } from './repositories/task-token';
import type { ITaskRepository, TCreateTaskInput } from './repositories/task.repository';

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
      userId,
      categoryId: dto.categoryId ?? null,
      expiredAt: dto.expiredAt ? new Date(dto.expiredAt) : null,
    };

    return this.taskRepository.create(data);
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
