import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateUserRepositoryInput,
  UserRecord,
  UserRepository,
} from './user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserRepositoryInput: CreateUserRepositoryInput): Promise<UserRecord> {
    const user = await this.prisma.user.create({
      data: {
        email: createUserRepositoryInput.email,
        password: createUserRepositoryInput.password,
        name: createUserRepositoryInput.name,
      },
    });

    return this.toUserRecord(user);
  }

  async findById(id: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return this.toUserRecord(user);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return this.toUserRecord(user);
  }

  private toUserRecord(user: User): UserRecord {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}