import * as dotenv from 'dotenv';
dotenv.config();

export function formatFileUrl(url: string | undefined | null): string | null {
    if (typeof url !== 'string' || !url.trim()) return url as any;

    let cleanUrl = url;

    // 1. Aggressively strip any surrounding quotes or stray commas from malformed DB entries
    cleanUrl = cleanUrl.replace(/^["']+|["',]+$/g, '').replace(/\\"/g, '');

    // 2. Safely get the backend base URL from env
    let baseUrl = process.env.BACKEND_URL || '';
    baseUrl = baseUrl.replace(/^["']+|["',]+$/g, ''); // Ensure env config itself is completely clean

    if (baseUrl && !baseUrl.endsWith('/')) {
        baseUrl += '/';
    }

    // 3. Prevent duplicate absolute URLs or re-apply the base URL if the string is just a path
    if (cleanUrl.includes('uploads/')) {
        // Extract strictly the relative path from 'uploads/' onwards
        const parts = cleanUrl.split('uploads/');
        cleanUrl = 'uploads/' + parts[parts.length - 1];
    } else if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        // If it's an external URL not containing 'uploads/', return it as is
        return cleanUrl;
    }

    // 4. Clean any leading slashes on the extracted path so we don't end up with baseUrl//uploads
    cleanUrl = cleanUrl.replace(/^\/+/, '');

    return `${baseUrl}${cleanUrl}`;
}
