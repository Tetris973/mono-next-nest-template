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
import { Role } from '@server/auth/role.enum';
import { Roles } from '@server/auth/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    const users = this.userService.findAll();
    const result = users.map(({ roles, ...rest }) => rest);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.userService.findOne(+id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { roles, ...rest } = user;
    return rest;
  }

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedData = this.userService.update(+id, updateUserDto);
    if (!updatedData)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return updatedData;
  }

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
