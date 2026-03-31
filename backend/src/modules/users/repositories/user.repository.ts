import { TUser } from '../entites/users.entity';

export type TCreateUserRepositoryInput = {
  email: string;
  password: string;
  name: string;
};

export interface IUserRepository {
  create(data: TCreateUserRepositoryInput): Promise<TUser>;
  findById(id: string): Promise<TUser | null>;
  findByEmail(email: string): Promise<TUser | null>;
}
