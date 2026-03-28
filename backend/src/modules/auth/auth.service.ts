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
import { JwtPayload } from './types/jwt-payload.type';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
        };

        const accessToken = await this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get('JWT_ACCESS_SECRET')!,
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES')!,
            },
        );

        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES')!;

        const refreshToken = await this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get('JWT_REFRESH_SECRET')!,
                expiresIn
            }
        );

        const expiresAt = getExpirationDate(expiresIn);

        try {
            await this.refreshRepository.create({
                userId: user.id,
                token: refreshToken,
                expiresAt,
            });

            return {
                message: 'Login success',
                accessToken,
                refreshToken
            };
        } catch (error) {
            console.error("Register error: ", error);
            throw new InternalServerErrorException('Failed to register user');
        }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        let decoded: JwtPayload;
        try {
            decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET')!,
            });
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const token = await this.refreshRepository.findByToken(refreshToken);

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        if (token.revokedAt && token.replacedByTokenId) {
            const allTokens = await this.refreshRepository.findByUserId(token.userId);

            await Promise.all(
                allTokens.map(t =>
                    this.refreshRepository.update(t.id, {
                        revokedAt: new Date(),
                    })
                )
            );

            throw new UnauthorizedException('Token reuse detected');
        }

        if (token.revokedAt) {
            throw new UnauthorizedException('Token revoked');
        }

        if (token.expiresAt < new Date()) {
            throw new UnauthorizedException('Token expired');
        }

        const payload: JwtPayload = {
            sub: decoded.sub,
            email: decoded.email,
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET')!,
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES')!,
        });

        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES')!;

        const newRefreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET')!,
            expiresIn,
        });

        const expiresAt = getExpirationDate(expiresIn);

        try {
            const newToken = await this.refreshRepository.create({
                userId: token.userId,
                token: newRefreshToken,
                expiresAt,
            });

            await this.refreshRepository.update(token.id, {
                revokedAt: new Date(),
                replacedByTokenId: newToken.id,
            });

            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            console.error('Refresh error:', error);
            throw new InternalServerErrorException('Failed to refresh token');
        }
    }

    async logout(userId: string) {
        const tokens = await this.refreshRepository.findByUserId(userId);

        if (tokens.length === 0) {
            return {
                message: 'Logout success',
            };
        }

        await Promise.all(
            tokens.map(t =>
                this.refreshRepository.update(t.id, {
                    revokedAt: new Date(),
                })
            )
        );

        return {
            message: 'Logout success',
        };
    }
}
