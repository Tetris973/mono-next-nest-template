import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthzModule } from './authz/authz.module';
import { RoleModule } from './role/role.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    // !!! This import must be before any other !!!
    ConfigModule, // Custom config modul
    PrismaModule,
    AuthModule,
    UserModule,
    AuthzModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
