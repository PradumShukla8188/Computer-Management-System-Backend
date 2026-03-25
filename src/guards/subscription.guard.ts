import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from 'src/models';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(
        @InjectModel(Subscription.name) private SubscriptionModel: Model<Subscription>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const instituteId = request.params?.id || request.body?.instituteId || request.query?.instituteId;

        if (!instituteId) {
            throw new ForbiddenException('Institute ID is required to verify subscription.');
        }

        const now = new Date();

        const activeSubscription = await this.SubscriptionModel.findOne({
            instituteId,
            status: 'ACTIVE',
            startDate: { $lte: now },
            endDate: { $gte: now },
        });

        if (!activeSubscription) {
            throw new ForbiddenException(
                'No active subscription found for this institute. Please subscribe to access this feature.',
            );
        }

        // Attach subscription info to the request for downstream use
        request['subscription'] = activeSubscription;

        return true;
    }
}
