export type CreateUserRepositoryInput = {
    email: string
    password: string
    name: string
};

export type UserRecord = {
    id: string
    email: string
    password: string
    name: string
    createdAt: Date
    updatedAt: Date
};

export abstract class UserRepository {
    abstract create(data: CreateUserRepositoryInput): Promise<UserRecord>;
    abstract findById(id: string): Promise<UserRecord | null>;
    abstract findByEmail(email: string): Promise<UserRecord | null>;
}