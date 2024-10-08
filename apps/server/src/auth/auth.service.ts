import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '@server/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from '@server/modules/user/dto/create-user.dto';
import { FieldAlreadyInUseException } from '@server/common/exceptions/field-already-in-use.exception';
import { AuthzService } from '@server/authz/authz.service';
import { UserNotFoundException } from '@server/common/exceptions/user-not-found.exception';
import { InvalidCredentialsException } from '@server/common/exceptions/invalid-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private authzService: AuthzService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async signup(createUserDto: CreateUserDto) {
    const { password, username } = createUserDto;
    const user = await this.userService.findOne({
      username,
    });
    if (user) {
      throw new FieldAlreadyInUseException('Username', username);
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
      throw new UserNotFoundException(username);
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      this.logger.error('Incorrect password provided');
      throw new InvalidCredentialsException();
    }
    return this.userService.findOne({ username });
  }

  /**
   * Log a user in and return a JWT
   */
  async login(user: User): Promise<{ accessToken: string }> {
    const res = await this.authzService.findAllRolesOfUser(user);
    const roles = res.map((role) => role.name);
    const payload: IJwtPayload = { sub: user.id, roles };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
