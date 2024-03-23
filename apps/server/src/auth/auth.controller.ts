import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // skip the JWT auth but not the local auth
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login') // TODO: Use a DTO with class-validator rules instead of a Record<string, any>
  async login(@Request() req: any) {
    console.log('AUTH CONTROLLER: REQ.SAFE_USER ', req.user);
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  // TODO: Replace 'any' with the actual request type that conatins a user property
  getProfile(@Request() req: any) {
    return req.user;
  }
}
