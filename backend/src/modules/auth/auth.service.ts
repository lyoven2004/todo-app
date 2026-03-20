import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from '../users/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(private userRepository: UserRepository) { }

    async register(registerDto: RegisterDto) {
        const { email, name, password } = registerDto;

        const emailNormalized = email.toLowerCase().trim();

        const existing = await this.userRepository.findByEmail(email);

        if (existing) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

        const now = new Date();

        const userEntity = UserEntity.create({
            id: randomUUID(),
            email,
            passwordHash: hashedPassword,
            name,
            createdAt: now,
            updatedAt: now,
        })

        try {
            const user = await this.userRepository.create({
                email: userEntity.email,
                password: userEntity.passwordHash,
                name: userEntity.name,
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
