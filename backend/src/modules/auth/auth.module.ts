import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { RefreshRepository } from './repositories/refresh-repository';
import { PrismaRefreshRepository } from './repositories/prisma-refresh-repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: RefreshRepository,
      useClass: PrismaRefreshRepository,
    },
  ],
  exports: [RefreshRepository]
})
export class AuthModule { }
