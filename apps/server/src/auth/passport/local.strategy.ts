import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateCredentials(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    // We can do other check on the user from this point
    console.log('LOCAL STRAT: SAFE USER check', user);
    return user;
  }
}
