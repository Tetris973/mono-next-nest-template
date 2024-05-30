import { Controller, Body, Post, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from './public.decorator';
import { CurrentUser } from './user.decorator';
import { User } from '@prisma/client';
import { UserDto } from '@server/user/dto/user.dto';
import { plainToClass } from 'class-transformer';
import { JwtDto } from './dto/jwt.dto';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '@server/user/dto/create-user.dto';
import { LogInUserDto } from '@server/user/dto/log-in-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const newUser = await this.authService.signup(createUserDto);
    return plainToClass(UserDto, newUser);
  }

  @ApiBody({ type: LogInUserDto })
  @Public() // skip the JWT auth but not the local auth
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User): Promise<JwtDto> {
    const res = await this.authService.login(user);
    return plainToClass(JwtDto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return plainToClass(UserDto, user);
  }
}
