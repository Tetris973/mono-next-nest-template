import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@server/modules/user/user.service';
import { IJwtPayload } from '@server/auth/interfaces/jwt-payload.interface';
import { Request } from 'express';
import { AllConfig } from '@server/config/config.module';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService<AllConfig>,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies.Authentication;
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('main.JWT_SECRET', { infer: true }),
    });
  }

  /**
   * Validates the JWT payload and retrieves the user.
   *
   * Where does the payload come from?
   * 1. Passport verifies the JWT signature and decodes it.
   * 2. This method is called by the strategy with the decoded payload.
   *
   * Note: This method can be extended for additional checks
   * (e.g., token revocation) or to enrich the user object.
   */
  async validate(payload: IJwtPayload) {
    const user = await this.userService.findOne({ id: payload.sub });
    if (!user) {
      // This error can be caused by a valid user logging in, get a valid JWT and then their account was deleted.
      // The JWT is still valid but the user is not found.
      throw new UnauthorizedException('User not found during JWT validation');
    }
    return user;
  }
}
