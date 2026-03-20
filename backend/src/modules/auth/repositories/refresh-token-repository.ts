import { TRefreshToken } from '../entities/refresh-token.entity';

export type CreateRefreshTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export abstract class RefreshRepository {
  abstract create(data: CreateRefreshTokenInput): Promise<TRefreshToken>;
  abstract findById(id: string): Promise<TRefreshToken | null>;
  abstract findByUserId(userId: string): Promise<TRefreshToken[]>;
  abstract revoke(id: string): Promise<TRefreshToken>;
}