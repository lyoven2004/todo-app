import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TCreateUserRepositoryInput, IUserRepository } from './user.repository';
import { TUser } from '../entites/users.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserRepositoryInput: TCreateUserRepositoryInput,
  ): Promise<TUser> {
    return this.prisma.user.create({
      data: {
        email: createUserRepositoryInput.email,
        password: createUserRepositoryInput.password,
        name: createUserRepositoryInput.name,
      },
    });
  }

  async findById(id: string): Promise<TUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<TUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
