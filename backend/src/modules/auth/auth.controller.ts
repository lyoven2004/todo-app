import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
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
