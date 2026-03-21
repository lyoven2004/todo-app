import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ITaskRepository, TCreateTaskInput } from "./task.repository";
import { TaskPriority, TaskStatus, TTask } from "../entities/task.entity";
import { PrismaTaskMapper } from "../mappers/prisma-task.mapper";

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: TCreateTaskInput): Promise<TTask> {
        const task = await this.prisma.task.create({
            data: PrismaTaskMapper.toPrismaCreate(data)
        });

        return PrismaTaskMapper.toDomain(task);
    }

    async findById(id: string): Promise<TTask | null> {
        const task = await this.prisma.task.findUnique({ where: { id } })

        if (!task) return null;

        return PrismaTaskMapper.toDomain(task);
    }

    async findByUserId(userId: string): Promise<TTask[]> {
        const tasks = await this.prisma.task.findMany({ where: { userId } });
        return tasks.map(PrismaTaskMapper.toDomain);
    }
}