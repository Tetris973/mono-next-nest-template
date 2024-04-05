import { Module, Global } from '@nestjs/common';
import { AuthzService } from './authz.service';
import { UserModule } from '@server/user/user.module';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { PermissionsGuard } from './permissions.guard';

@Global() // To make the AuthzService available to the entire application
@Module({
  imports: [UserModule],
  providers: [AuthzService, CaslAbilityFactory, PermissionsGuard],
  exports: [PermissionsGuard, CaslAbilityFactory],
})
export class AuthzModule {}
