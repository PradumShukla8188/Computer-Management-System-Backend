import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from 'src/constants/enum';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const institutes = request['user']?.institutes || [];
    const isAdmin = institutes.some(
      (inst) => inst?.roleId?.name === Role.Admin.name || Role.SuperAdmin.name,
    );

    if (request['user'] && isAdmin) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
