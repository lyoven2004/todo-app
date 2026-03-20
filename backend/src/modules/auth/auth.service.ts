import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from '../users/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import ms from 'ms';
import { REPLCommand } from 'repl';
import { RefreshRepository } from './repositories/refresh-repository';

@Injectable()
export class AuthService {
    constructor(
        private refreshRepository: RefreshRepository,
        private userRepository: UserRepository,
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

        const tokenHash = createHash('sha256')
            .update(rawRefreshToken)
            .digest('hex');

        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES')!;
        const expiresAt = new Date(Date.now() + ms(expiresIn));

        try {
            await this.refreshRepository.create({
                userId: user.id,
                tokenHash,
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
