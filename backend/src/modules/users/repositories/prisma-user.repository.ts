import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateUserRepositoryInput,
  UserRepository,
} from './user.repository';
import { User } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserRepositoryInput: CreateUserRepositoryInput): Promise<User> {

    return this.prisma.user.create({
      data: {
        email: createUserRepositoryInput.email,
        password: createUserRepositoryInput.password,
        name: createUserRepositoryInput.name,
      }
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}