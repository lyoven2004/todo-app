import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ITaskRepository, TCreateTaskInput } from "./task.repository";
import { TaskPriority, TaskStatus, TTask } from "../entities/task.entity";

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: TCreateTaskInput): Promise<TTask> {
        const task = await this.prisma.task.create({ 
            data: this.toPrismaCreateData(data) 
        });

        return this.toTask(task);
    }

    async findById(id: string): Promise<TTask | null> {
        const task = await this.prisma.task.findUnique({ where: { id } })
        return this.toTask(task);
    }

    async findByUserId(userId: string): Promise<TTask[]> {
        const tasks = await this.prisma.task.findMany({ where: { userId } });
        return tasks.map(this.toTask);
    }

    private toPrismaCreateData(data: TCreateTaskInput) {
        return {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            expiredAt: data.expiredAt,
            user: {
                connect: {
                    id: data.userId,
                },
            },
            category: data.categoryId
                ? {
                    connect: {
                        id: data.categoryId,
                    },
                }
                : undefined,
        };
    }
    private toTask(task: any): TTask {
        return {
            ...task,
            status: task.status as TaskStatus,
            priority: task.priority as TaskPriority,
        };
    }
}