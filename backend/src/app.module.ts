import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { APP_GUARD } from '@nestjs/core';
import { AcessTokenGuard } from './common/guards/access-token.guard';

@Module({
  imports: [
    AuthModule,
    TasksModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AcessTokenGuard,
    },
  ],
})
export class AppModule { }
