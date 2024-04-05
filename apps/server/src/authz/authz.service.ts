import { Injectable } from '@nestjs/common';
import { UserRepository } from '@server/user/user.repository';
import { User } from '@prisma/client';

@Injectable()
export class AuthzService {
  constructor(private userRepository: UserRepository) {}
  async findAllPermissionsOfUser(user: User) {
    return await this.userRepository.findAllPermissions(user.id);
  }

  async findAllRolesOfUser(user: User) {
    return await this.userRepository.findAllRoles(user.id);
  }
}
