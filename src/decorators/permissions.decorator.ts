import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

// Accepts a single string OR an array of strings
export const Permission = (permission: string | string[]) =>
    SetMetadata(PERMISSIONS_KEY, Array.isArray(permission) ? permission : [permission]);
