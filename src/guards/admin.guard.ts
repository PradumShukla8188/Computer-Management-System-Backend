import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from 'src/constants/enum';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    // ✅ Match the shape AuthGuard actually sets
    const roleName = user?.role?.name;

    // ✅ Fix the OR bug - compare both sides properly
    const isAdmin = roleName === Role.Admin.name || roleName === Role.SuperAdmin.name;

    if (isAdmin) {
      return true;
    }

    throw new UnauthorizedException('Admin access required');
  }
}
