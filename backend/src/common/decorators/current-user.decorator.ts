import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from 'src/modules/auth/types/jwt-payload.type';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
