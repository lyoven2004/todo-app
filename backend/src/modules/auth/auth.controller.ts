import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import type { RefreshRequestUser } from './types/refresh-request-user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@CurrentUser() user: RefreshRequestUser) {
    return this.authService.refreshToken(user);
  }

  @Public()
  @Post('logout')
  async logoutAll(@CurrentUser('sub') userId?: string) {
    return await this.authService.logout(userId);
  }
}
