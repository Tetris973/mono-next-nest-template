import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// This should be a real class/interface representing a user entity
// TODO: replace this with a real entity class from Prisma
export type User = any;

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      username: 'tetris973',
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
    },
    {
      userId: 2,
      username: 'default-user',
      password: '$2b$10$KQklnlzZ/dLdNW5/I5INjODDWVUQeDRSRKmKUJVU/iOpSVfG2ZVuG',
    },
  ];

  create(createUserDto: CreateUserDto) {
    this.users.push({ ...createUserDto, userId: this.users.length + 1 });
    const createdUser = this.users[this.users.length - 1];
    if (createdUser.password) {
      const { password, ...result } = createdUser;
      return result;
    }
    return 'something went wrong';
  }

  findAll() {
    const result = this.users.map(({ password, ...user }) => user);
    return result;
  }

  findOne(identifier: string | number): User | undefined {
    if (typeof identifier === 'string') {
      return this.users.find((user) => user.username === identifier);
    }
    const user = this.users.find((user) => user.userId === identifier);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.users.find((user) => user.userId === id);
    if (user) {
      Object.assign(user, updateUserDto);
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  remove(id: number) {
    this.users.splice(
      this.users.findIndex((user) => user.userId === id),
      1,
    );
  }
}
