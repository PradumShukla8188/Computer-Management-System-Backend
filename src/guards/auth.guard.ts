import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { User, UserInstitute } from 'src/models';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(UserInstitute.name) private UserInstituteModel: Model<UserInstitute>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // console.log('AuthGuard - Extracted Token:', token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('SECRET'),
      });

      // console.log('AuthGuard - JWT Payload:', payload);

      const user = await this.UserModel.findOne({
        _id: payload._id,
      });

      if (user) {
        const institutes = await this.UserInstituteModel.find({ userId: user._id, isActive: true })
          .populate('instituteId', '_id name subdomain')
          .populate('roleId', '_id name');

        request['user'] = { ...user.toObject(), institutes };
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
