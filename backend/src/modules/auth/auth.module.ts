import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaRefreshRepository } from './repositories/prisma-refresh-token.repository';
import { JwtModule } from '@nestjs/jwt';
import { REFRESH_TOKEN_REPOSITORY } from './repositories/refresh-token';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshRepository,
    },
  ],
  exports: [REFRESH_TOKEN_REPOSITORY]
})
export class AuthModule { }
