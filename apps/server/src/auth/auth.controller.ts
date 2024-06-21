import { Controller, Body, Post, Get, HttpCode, HttpStatus, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from './public.decorator';
import { CurrentUser } from './user.decorator';
import { User } from '@prisma/client';
import { UserDto } from '@server/user/dto/user.dto';
import { plainToClass } from 'class-transformer';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '@server/user/dto/create-user.dto';
import { LoginUserDto } from '@server/user/dto/log-in-user.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const newUser = await this.authService.signup(createUserDto);
    return plainToClass(UserDto, newUser);
  }

  @ApiBody({ type: LoginUserDto })
  @Public() // skip the JWT auth but not the local auth
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    const expires = new Date();
    expires.setMilliseconds(expires.getMilliseconds() + ms(this.configService.getOrThrow<string>('jwtExpiration')));

    const loginPayload = await this.authService.login(user);
    response.cookie('Authentication', loginPayload.accessToken, {
      secure: true,
      httpOnly: true,
      expires,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return plainToClass(UserDto, user);
  }
}
