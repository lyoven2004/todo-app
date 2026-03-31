import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.type';
import { RefreshRequestUser } from '../types/refresh-request-user.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,
    'jwt-refresh',
) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_REFRESH_SECRET')!,
            passReqToCallback: true,
        })
    }
    
    validate(req: Request, payload: JwtPayload): RefreshRequestUser {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization header');
        }
        const refreshToken = authHeader.replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }
}