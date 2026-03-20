import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { randomBytes } from 'crypto';

import type { IUserRepository } from '../users/repositories/user.repository';
import { USER_REPOSITORY } from '../users/repositories/user.token';
import type { IRefreshRepository } from './repositories/refresh-token.repository';
import { REFRESH_TOKEN_REPOSITORY } from './repositories/refresh-token';

import { getExpirationDate } from 'src/common/utils/time.util';

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private userRepository: IUserRepository,

        @Inject(REFRESH_TOKEN_REPOSITORY)
        private refreshRepository: IRefreshRepository,
        
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, name, password } = registerDto;

        const emailNormalized = email.toLowerCase().trim();

        const existing = await this.userRepository.findByEmail(email);

        if (existing) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, Number(this.configService.get('SALT_ROUNDS')));

        try {
            const user = await this.userRepository.create({
                email: emailNormalized,
                password: hashedPassword,
                name: name.trim()
            });

            return {
                message: 'Register success',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            };
        } catch (error) {
            console.error("Register error: ", error);
            throw new InternalServerErrorException('Failed to register user');
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
            },
            {
                secret: this.configService.get('JWT_ACCESS_SECRET')!,
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES')!,
            },
        );

        const rawRefreshToken = randomBytes(64).toString('hex');

        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES')!;

        const token = await this.jwtService.signAsync(
            { rawRefreshToken },
            {
                secret: this.configService.get('JWT_REFRESH_SECRET')!,
                expiresIn
            }
        );

        const expiresAt = getExpirationDate(expiresIn);

        try {
            await this.refreshRepository.create({
                userId: user.id,
                token,
                expiresAt,
            });

            return {
                message: 'Login success',
                accessToken,
                rawRefreshToken
            };
        } catch (error) {
            console.error("Register error: ", error);
            throw new InternalServerErrorException('Failed to register user');
        }
    }
}
