import { TRefreshToken } from "../entities/refresh-token.entity";

export type CreateRefreshTokenInput = {
  userId: string;
  token: string;
  expiresAt: Date;
};

export interface IRefreshRepository {
  create(data: CreateRefreshTokenInput): Promise<TRefreshToken>;
  findById(id: string): Promise<TRefreshToken | null>;
  findByUserId(userId: string): Promise<TRefreshToken[]>;
  revoke(id: string): Promise<TRefreshToken>;
}