import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { IJwtPayload } from './jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
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
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * The validate() method deserves some discussion. For the jwt-strategy, Passport first verifies the JWT's signature and decodes the JSON.
   * It then invokes our validate() method passing the decoded JSON as its single parameter.
   * Based on the way JWT signing works, we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.
   * As a result of all this, our response to the validate() callback is trivial: we simply return an object containing the userId and username properties.
   * Recall again that Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object.
   * It's also worth pointing out that this approach leaves us room ('hooks' as it were) to inject other business logic into the process.
   * For example, we could do a database lookup in our validate() method to extract more information about the user, resulting in a more enriched user object being available in our Request.
   * This is also the place we may decide to do further token validation, such as looking up the userId in a list of revoked tokens, enabling us to perform token revocation.
   * The model we've implemented here in our sample code is a fast, "stateless JWT" model, where each API call is immediately authorized based on the presence of a valid JWT, and a small bit of information about the requester (its userId and username) is available in our Request pipeline.
   */
  async validate(payload: IJwtPayload) {
    const user = await this.userService.findOne({ id: payload.sub });
    if (!user) throw new Error('Unexpected error, user not found during JWT validation');
    return user;
  }
}
