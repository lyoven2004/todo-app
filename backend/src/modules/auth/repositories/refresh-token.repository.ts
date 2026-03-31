import { TRefreshToken } from '../entities/refresh-token.entity';

export type TCreateRefreshTokenInput = {
  userId: string;
  token: string;
  expiresAt: Date;
};

export interface IRefreshRepository {
  create(data: TCreateRefreshTokenInput): Promise<TRefreshToken>;
  findById(id: string): Promise<TRefreshToken | null>;
  findByUserId(userId: string): Promise<TRefreshToken[]>;
  revoke(id: string): Promise<TRefreshToken>;
  findByToken(token: string): Promise<TRefreshToken | null>;
  update(id: string, data: Partial<TRefreshToken>): Promise<TRefreshToken>;
  rotateToken(
    oldTokenId: string,
    userId: string,
    newToken: string,
    expiresAt: Date,
  ): Promise<TRefreshToken>;
}
