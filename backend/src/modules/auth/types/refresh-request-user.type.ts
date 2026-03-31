import { JwtPayload } from './jwt-payload.type';

export type RefreshRequestUser = JwtPayload & {
  refreshToken: string;
};
