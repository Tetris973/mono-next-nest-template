import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { IJwtPayload } from './passport/jwt-payload.interface';
import { CreateUserDto } from '@server/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { password, username } = createUserDto;
    const user = await this.userService.findOne({
      username: username,
    });
    if (user) {
      throw new Error('Username is already taken');
    }
    const hash = await bcrypt.hash(password, 10);
    return this.userService.create({ username, password: hash });
  }

  /**
   * Validate a user's credentials
   * @returns the user if the credentials are valid, or null if they are not
   */
  async validateCredentials(username: string, pass: string) {
    const user = await this.userService.userCredentials({ username });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }
    return this.userService.findOne({ username });
  }

  /**
   * Log a user in and return a JWT
   */
  async login(user: User): Promise<{ access_token: string }> {
    const payload: IJwtPayload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
