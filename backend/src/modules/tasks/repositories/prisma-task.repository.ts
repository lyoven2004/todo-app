import { Injectable } from "@nestjs/common";
import {
    Task as PrismaTask,
    TaskStatus as PrismaTaskStatus,
    TaskPriority as PrismaTaskPriority,
    Prisma,
} from '@prisma/client';
import { PrismaService } from "prisma/prisma.service";
import { ITaskRepository, TCreateTaskInput } from "./task.repository";
import { TaskPriority, TaskStatus, TTask } from "../entities/task.entity";

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
    constructor(private readonly prisma: PrismaService) { }

    toDomain(task: PrismaTask): TTask {
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

    async create(userId: string, data: TCreateTaskInput): Promise<TTask> {
        const task = await this.prisma.task.create({
            data: {
                title: data.title,
                description: data.description ?? null,
                status: data.status,
                priority: data.priority,
                categoryId: data.categoryId ?? null,
                expiredAt: data.expiredAt ? new Date(data.expiredAt) : null,
                userId,
            },
        });

        return this.toDomain(task);
    }

    async findById(id: string): Promise<TTask | null> {
        const task = await this.prisma.task.findUnique({ where: { id } })

        if (!task) return null;

        return this.toDomain(task);
    }

    async findByUserId(userId: string): Promise<TTask[]> {
        const tasks = await this.prisma.task.findMany({ where: { userId } });
        return tasks.map(this.toDomain);
    }

    async findByIdAndUserId(id: string, userId: string): Promise<TTask | null> {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                userId,
            },
        });
        
        if (!task) return null;

        return this.toDomain(task)
    }

    async delete(id: string): Promise<void> {
        await this.prisma.task.delete({
            where: { id },
        });
    }


}