import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatFileUrl } from './file-url.helper';

@Injectable()
export class FileUrlInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => this.transformResponse(data))
        );
    }

    private transformResponse(data: any): any {
        if (!data) return data;

        // Safely convert everything to a plain JS object/array, automatically resolving ObjectIds and Dates to strings
        let parsedData = data;
        try {
            // We only stringify if it's not already a primitive
            if (typeof data === 'object') {
                parsedData = JSON.parse(JSON.stringify(data));
            }
        } catch (e) {
            return data;
        }

        return this.traverseAndFormat(parsedData);
    }

    private traverseAndFormat(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.traverseAndFormat(item));
        }

        if (obj !== null && typeof obj === 'object') {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];

                    if (
                        typeof value === 'string' &&
                        (value.includes('uploads/') || /^(profilePhoto|aadhaarImage|banner|certificateFile|fileUrl|studentPhoto|uploadEducationProof|uploadIdentityProof)$/.test(key))
                    ) {
                        obj[key] = formatFileUrl(value);
                    } else {
                        obj[key] = this.traverseAndFormat(value);
                    }
                }
            }
        }

        return obj;
    }
}
