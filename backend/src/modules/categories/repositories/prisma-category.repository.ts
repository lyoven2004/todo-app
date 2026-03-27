import { Injectable } from "@nestjs/common";
import { ICategoryRepository, TCreateCategoryInput, TQueryCategory } from "./category.repository";
import { PrismaService } from "prisma/prisma.service";
import { TCategory } from "../entities/category.entity";
import { Prisma } from "@prisma/client";

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

    async findAllByUserId(
        userId: string,
        query: TQueryCategory,
    ): Promise<TCategory[]> {
        const where: Prisma.CategoryWhereInput = {
            userId,
        }

        if (query.search?.trim()) {
            where.name = {
                contains: query.search.trim(),
                mode: "insensitive",
            }
        }

        const categories = await this.prisma.category.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
        })

        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            userId: category.userId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }))
    }
}