import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate a user's credentials
   * @returns the user if the credentials are valid, or null if they are not
   */
  // TODO: update the return type
  async validateCredentials(username: string, pass: string): Promise<any> {
    // TODO: exclude passwd from the query or strip it from the result
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }

    const { password, ...result } = user;
    // TODO: below in console log, don't use DTO here and class-validator as we already know the data is valid from the database
    console.log('AUTH SERVICE: PRISMA USER -> SAFE USER Interface');
    password; // TODO: Remove password from the result with class-transformer
    return result;
  }

  /**
   * Log a user in and return a JWT
   * @param user the loginUserDTO That is returned from the validateUser method above, TODO: create this DTO
   */
  async login(user: any): Promise<{ access_token: string }> {
    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
