import { User } from '@prisma/client';

export type CreateUserRepositoryInput = {
    email: string
    password: string
    name: string
};

export abstract class UserRepository {
    abstract create(data: CreateUserRepositoryInput): Promise<User>;
    abstract findById(id: string): Promise<User | null>;
    abstract findByEmail(email: string): Promise<User | null>;
}

