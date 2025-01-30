import { envConstant } from '@constants/index';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: envConstant.REDIS_HOST || 'localhost',
        port: parseInt(configService.get<string>('REDIS_PORT')!) || 6379,
      },
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};


