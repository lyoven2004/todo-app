export type TRefreshToken = {
    id: string;
    userId: string;
    tokenHash: string;
    createdAt: Date;
    expiresAt: Date;
    revokedAt: Date | null;
    replacedByTokenId: string | null;
};