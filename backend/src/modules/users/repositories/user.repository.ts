import { TUser } from "../entites/users.entity";

export type CreateUserRepositoryInput = {
    email: string
    password: string
    name: string
};

export interface IUserRepository {
    create(data: CreateUserRepositoryInput): Promise<TUser>;
    findById(id: string): Promise<TUser | null>;
    findByEmail(email: string): Promise<TUser | null>;
}

