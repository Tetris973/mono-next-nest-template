import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      username,
    });
    if (user) {
      throw new Error('Username is already taken');
    }
    const hash = await bcrypt.hash(password, 10);
    return this.userService.create({ username, password: hash });
  }

  /**
   * Validate a user's credentials
   * @returns the user if the credentials are valid, or throws an exception if they are not
   */
  async validateCredentials(username: string, pass: string) {
    const user = await this.userService.userCredentials({ username });
    if (!user) {
      throw new NotFoundException('The username does not exist.');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('The password is incorrect.');
    }
    return this.userService.findOne({ username });
  }

  /**
   * Log a user in and return a JWT
   */
  async login(user: User): Promise<{ accessToken: string }> {
    const payload: IJwtPayload = { username: user.username, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
