import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Role } from 'src/constants/enum';

@Injectable()
export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (request['user'] && request['user'].roleId && request['user'].roleId.name && request['user'].roleId.name === Role.Admin.name) {
            return true;
        }
        throw new UnauthorizedException();
    }
}
