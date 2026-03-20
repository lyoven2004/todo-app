import { Injectable } from "@nestjs/common";
import { CreateRefreshTokenInput, RefreshRepository } from "./refresh-repository";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class PrismaRefreshRepository implements RefreshRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRefreshTokenInput) {
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
        revokedAt: new Date(),
      },
    });
  }
}