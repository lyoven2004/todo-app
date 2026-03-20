import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaRefreshRepository } from './repositories/prisma-refresh-token.repository';
import { JwtModule } from '@nestjs/jwt';
import { REFRESH_TOKEN_REPOSITORY } from './repositories/refresh-token';

@Module({
  imports: [UsersModule, ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshRepository,
    },
  ],
  exports: [REFRESH_TOKEN_REPOSITORY]
})
export class AuthModule { }
