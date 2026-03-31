export type TRefreshToken = {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedByTokenId: string | null;
};
