import { Inject, Injectable } from "@nestjs/common";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class CachingService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    /**
     * @description Get value from cache
     * @param key 
     * @returns 
     */
    async get(key: string): Promise<string | undefined> {
        return this.cacheManager.get(key);
    }

    /**
     * @description Set value in cache
     * @param key 
     * @param value 
     * @returns 
     */
    async set(key: string, value: any): Promise<string> {
        return this.cacheManager.set(key, value);
    }

    /**
     * @description Clear value in cache
     */
    async clear(): Promise<boolean> {
        return this.cacheManager.clear();
    }
}