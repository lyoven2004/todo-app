import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async register(registerDto: RegisterDto) {
        const { email, name, password } = registerDto;

        const emailNormalized = email.toLowerCase().trim();

        const existing = await this.prisma.user.findUnique({
            where: { email: emailNormalized },
        });

        if (existing) {
            throw new BadRequestException('Email already exists');
        }

        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: emailNormalized,
                    password: hashedPassword,
                    name: name.trim(),
                },
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
}
