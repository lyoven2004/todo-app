import { Injectable } from "@nestjs/common";
import { ICategoryRepository, TCreateCategoryInput, TQueryCategory } from "./category.repository";
import { PrismaService } from "prisma/prisma.service";
import { TCategory } from "../entities/category.entity";
import { Prisma } from "@prisma/client";
import { TPaginationResult } from "src/common/types/pagination.type";
import { normalize } from "path";
import { normalizeName } from "src/common/utils/normalize.util";

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
    ): Promise<TPaginationResult<TCategory>> {

        const {
            search,
            page = 1,
            limit = 7,
        } = query;

        const normalizedSearch = normalizeName(search || "");
        const skip = (page - 1) * limit;

        const where: Prisma.CategoryWhereInput = {
            userId,
            ...(normalizedSearch
                ? {
                    name: {
                        contains: normalizedSearch,
                        mode: "insensitive",
                    },
                }
                : {}),
        }

        const [categories, total] = await Promise.all([
            this.prisma.category.findMany({
                where,
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),

            this.prisma.category.count({
                where
            }),
        ]);

        return {
            page,
            total,
            totalPage: Math.ceil(total / limit),
            data: categories.map((category) => ({
                id: category.id,
                name: category.name,
                userId: category.userId,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
            }))
        }
    }
}