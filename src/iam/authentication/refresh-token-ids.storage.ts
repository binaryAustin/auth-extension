import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  public onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: '172.28.5.11',
      port: 6379,
    });
  }

  public onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }

  public async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  public async validate(
    userId: number,
    tokenIdToCheck: string,
  ): Promise<boolean> {
    const storedTokenId = await this.redisClient.get(this.getKey(userId));
    if (storedTokenId !== tokenIdToCheck)
      throw new InvalidatedRefreshTokenError();
    return storedTokenId === tokenIdToCheck;
  }

  public async invalidate(userId: number): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
