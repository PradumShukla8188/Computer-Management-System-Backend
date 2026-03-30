import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Institute, User, UserInstitute } from 'src/models';

// ✅ Strong typing for JWT
interface JwtPayload {
  _id: string;
  instituteId: string;
  roleId?: string;
}

// ✅ Extend request
export interface AuthRequest extends Request {
  user?: any;
  institute?: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Institute.name)
    private readonly instituteModel: Model<Institute>,

    @InjectModel(UserInstitute.name)
    private readonly userInstituteModel: Model<UserInstitute>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      // ✅ Verify JWT
      const payload = await this.verifyToken(token);

      // ✅ Validate payload structure
      if (!payload?._id || !payload?.instituteId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const [user, institute] = await Promise.all([
        this.userModel.findById(payload._id),
        this.instituteModel.findById(payload.instituteId),
      ]);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.deletedAt || user.status !== 'Active') {
        throw new ForbiddenException('User inactive or deleted');
      }

      if (!institute) {
        throw new UnauthorizedException('Institute not found');
      }

      // ✅ Validate user-institute relation
      const userInstitute = await this.userInstituteModel
        .findOne({
          userId: user._id,
          instituteId: institute._id,
          roleId: payload.roleId,
          isActive: true,
        })
        .populate('roleId', '_id name')
        .populate('instituteId', '_id name subdomain');

      if (!userInstitute) {
        throw new ForbiddenException('Access denied for this institute');
      }

      request.user = {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: userInstitute.roleId,
        institute: userInstitute.instituteId,
      };

      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  // =========================
  // 🔐 Helpers
  // =========================

  private extractToken(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) return '';

    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : '';
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private handleError(error: any): never {
    console.log('❌ AuthGuard Error:', {
      message: error?.message,
      stack: error?.stack,
    });

    if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
      throw error;
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
