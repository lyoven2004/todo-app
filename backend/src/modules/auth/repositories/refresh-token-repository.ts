import { RefreshToken } from '@prisma/client';

export type CreateRefreshTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export abstract class RefreshRepository {
  abstract create(data: CreateRefreshTokenInput): Promise<RefreshToken>;
  abstract findById(id: string): Promise<RefreshToken | null>;
  abstract findByUserId(userId: string): Promise<RefreshToken[]>;
  abstract revoke(id: string): Promise<RefreshToken>;
}