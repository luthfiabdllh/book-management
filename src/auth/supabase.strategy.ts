import { Injectable, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(SupabaseStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>('SUPABASE_URL')}/auth/v1/.well-known/jwks.json`,
      }),
      algorithms: ['ES256', 'HS256'], // Support both just in case
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    const user = {
      id: payload.sub,
      email: payload.email,
      role: payload.app_metadata?.role || 'MEMBER',
    };

    try {
      // Sync user to local database to ensure foreign key constraints are met
      await this.usersService.syncUser(user);
    } catch (error) {
      this.logger.error(`Failed to sync user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Gagal memproses data pengguna. Silakan coba login ulang.');
    }

    return user;
  }
}
