import { UserEntity } from '../entities/user.entity';

export type CreateUserRepositoryInput = {
    email: string
    password: string
    name: string
};

export abstract class UserRepository {
    abstract create(data: CreateUserRepositoryInput): Promise<UserEntity>;
    abstract findById(id: string): Promise<UserEntity | null>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
}

