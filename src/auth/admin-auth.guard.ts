import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoleName, Role } from '../user/role';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    return !!user.roles.find((role: Role) => role.name === RoleName.Admin);
  }
}
