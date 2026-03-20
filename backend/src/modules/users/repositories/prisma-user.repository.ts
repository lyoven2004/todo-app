import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateUserRepositoryInput,
  UserRepository,
} from './user.repository';
import { UserEntity } from '../entites/user.entity';


@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserRepositoryInput: CreateUserRepositoryInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: createUserRepositoryInput.email,
        password: createUserRepositoryInput.password,
        name: createUserRepositoryInput.name,
      },
    });

    return this.toUserRecord(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return this.toUserRecord(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return this.toUserRecord(user);
  }

  private toUserRecord(user: User): UserEntity {
    return({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}