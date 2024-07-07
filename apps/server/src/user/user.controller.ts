import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { CheckPermissions } from '@server/authz/permissions.decorator';
import { Action, User } from '@prisma/client';
import { PermissionsGuard } from '@server/authz/permissions.guard';
import { CaslAbilityFactory } from '@server/authz/casl-ability.factory/casl-ability.factory';
import { CurrentUser } from '@server/auth/user.decorator';
import { subject } from '@casl/ability';

@UseGuards(PermissionsGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  @CheckPermissions([Action.READ, 'User'])
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.findMany({ orderBy: { id: 'asc' } });
    return users.map((user) => plainToClass(UserDto, user));
  }

  @CheckPermissions([Action.READ, 'User'])
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.findOne({ id: Number(id) });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return plainToClass(UserDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ): Promise<UserDto> {
    const ability = await this.abilityFactory.createForUser(user);
    const canUpdate = ability.can(Action.UPDATE, subject('User', { id: Number(id) }));
    if (!canUpdate) throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    const update = await this.userService.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });
    return plainToClass(UserDto, update);
  }

  @CheckPermissions([Action.DELETE, 'User'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string): void {
    if (!Number.isInteger(Number(id))) throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    this.userService.delete({ id: Number(id) });
  }
}
