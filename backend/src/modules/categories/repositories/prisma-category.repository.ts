import { Injectable } from "@nestjs/common";
import { ICategoryRepository, TCreateCategoryInput } from "./category.repository";
import { PrismaService } from "prisma/prisma.service";
import { TCategory } from "../entities/category.entity";

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: TCreateCategoryInput, userId: string): Promise<TCategory> {
        return this.prisma.category.create({
            data: {
                name: data.name,
                userId,
            }
        });
    }

    async findByIdAndUserId(id: string, userId: string)
        : Promise<TCategory | null> {
        const category = await this.prisma.category.findFirst({
            where: {
                id,
                userId,
            },
        });

        return category ? category : null;
    }

    async findByNameAndUserId(name: string, userId: string)
        : Promise<TCategory | null> {
        const category = await this.prisma.category.findFirst({
            where: {
                name,
                userId,
            },
        });

        return category ? category : null;
    }
}