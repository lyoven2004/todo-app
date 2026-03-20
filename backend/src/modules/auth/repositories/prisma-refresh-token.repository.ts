import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { TCreateRefreshTokenInput, IRefreshRepository } from "./refresh-token.repository";
import dayjs from "dayjs";

@Injectable()
export class PrismaRefreshRepository implements IRefreshRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: TCreateRefreshTokenInput) {
        return this.prisma.refreshToken.create({ data });
    }

    async findById(id: string) {
        return this.prisma.refreshToken.findUnique({ where: { id } });
    }

    async findByUserId(userId: string) {
        return this.prisma.refreshToken.findMany({ where: { userId } });
    }

    async revoke(id: string) {
        return this.prisma.refreshToken.update({
            where: { id },
            data: {
                revokedAt: dayjs().toDate(),
            },
        });
    }
}