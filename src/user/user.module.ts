import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user';
import { Role } from './role';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User, Role])],
  exports: [UserService],
})
export class UserModule {}
