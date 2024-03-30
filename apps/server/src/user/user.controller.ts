import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { Roles } from '@server/auth/roles.decorator';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const { confirmPassword, ...userData } = createUserDto;
    const user = await this.userService.create(userData);
    return plainToClass(UserDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return users.map((user) => plainToClass(UserDto, user));
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.findOne({ id: Number(id) });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return plainToClass(UserDto, user);
  }

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.userService.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });
    return plainToClass(UserDto, user);
  }

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string): void {
    this.userService.delete({ id: Number(id) });
  }
}
