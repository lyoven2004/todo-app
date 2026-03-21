import {
    Task as PrismaTask,
    TaskStatus as PrismaTaskStatus,
    TaskPriority as PrismaTaskPriority,
    Prisma,
} from '@prisma/client';

import { TTask, TaskStatus, TaskPriority, } from '../entities/task.entity';
import { TCreateTaskInput } from '../repositories/task.repository';

export class PrismaTaskMapper {
    // Prisma -> Domain
    static toDomain(task: PrismaTask): TTask {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status as TaskStatus,
            priority: task.priority as TaskPriority,
            userId: task.userId,
            categoryId: task.categoryId,
            expiredAt: task.expiredAt,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        };
    }

    // Domain -> Prisma (create)
    static toPrismaCreate(
        data: TCreateTaskInput,
    ): Prisma.TaskCreateInput {
        return {
            title: data.title,
            description: data.description,
            status: data.status as PrismaTaskStatus,
            priority: data.priority as PrismaTaskPriority,
            expiredAt: data.expiredAt,
            user: {
                connect: { id: data.userId, },
            },
            category: data.categoryId
                ? {
                    connect: { id: data.categoryId, },
                }
                : undefined,
        };
    }
}