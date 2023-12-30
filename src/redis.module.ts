import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import {
  RedisClusterOptions,
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from './redis.interfaces';
import { REDIS_MODULE_OPTIONS_PROVIDER } from './redis.constants';
import { getInjectToken } from './redis.utils';
import Redis from 'ioredis';

@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    const providers = [
      {
        provide: REDIS_MODULE_OPTIONS_PROVIDER,
        useValue: options,
      },
      RedisModule.createClientProvider(options.name),
    ];

    return {
      module: RedisModule,
      providers: providers,
      exports: providers,
      global: options.isGlobal ? options.isGlobal : false,
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const providers = [
      RedisModule.createAsyncOptionsProvider(options),
      RedisModule.createClientProvider(options.name),
    ];

    if (options.useClass) {
      const useClass = options.useClass as Type<RedisModuleOptionsFactory>;
      providers.push({ provide: useClass, useClass: useClass });
    }

    return {
      module: RedisModule,
      imports: options.imports,
      providers: providers,
      exports: providers,
      global: options.isGlobal ? options.isGlobal : false,
    };
  }

  private static createAsyncOptionsProvider(
    options: RedisModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: REDIS_MODULE_OPTIONS_PROVIDER,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<RedisModuleOptionsFactory>,
    ];
    return {
      provide: REDIS_MODULE_OPTIONS_PROVIDER,
      useFactory: async (optionsFactory: RedisModuleOptionsFactory) =>
        await optionsFactory.createRedisModuleOptions(options.name),
      inject,
    };
  }

  private static createClientProvider(name: string): Provider {
    return {
      provide: getInjectToken(name),
      useFactory: (options: RedisModuleOptions) => {
        const o = options as RedisClusterOptions;
        if (o.nodes) return new Redis.Cluster(o.nodes, o.options);

        return new Redis(options);
      },
      inject: [REDIS_MODULE_OPTIONS_PROVIDER],
    };
  }
}
