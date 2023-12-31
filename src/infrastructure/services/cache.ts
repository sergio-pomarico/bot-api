import { env } from '@shared/utils';
import { createClient, RedisClientType } from 'redis';

type CacheValue = object | string | boolean | number;

export class CacheManager {
  constructor() {
    const {
      redis: { url },
    } = env;
    this.client = createClient({
      url,
    });
    this.connect();
  }

  private readonly client: RedisClientType;

  private connect = async (): Promise<void> => {
    if (this.client.isReady) return;
    await this.client.connect();
  };

  set = async (key: string, value: CacheValue, exp = 300): Promise<void> => {
    const valueToStore =
      typeof value === 'string' ? value : JSON.stringify(value);
    await this.connect();
    await this.client.set(key, valueToStore, { EX: exp });
  };

  get = async (key: string): Promise<CacheValue | null> => {
    await this.connect();
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  };
}
