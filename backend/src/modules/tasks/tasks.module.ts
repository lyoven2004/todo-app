import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaTaskRepository } from './repositories/prisma-task.repository';
import { TASK_REPOSITORY } from './repositories/task-token';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [TasksController],
  providers: [TasksService,
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    }
  ],
  exports: [TASK_REPOSITORY]
})
export class TasksModule {}
