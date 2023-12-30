
## nestjs-redis

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A [Nestjs](https://github.com/nestjs/nest) module provides a simple interface for working with [ioredis](https://github.com/redis/ioredis).

## Installation

```bash
$ npm i --save @gaosong886/nestjs-redis ioredis 
```

## Quick start

Import the `RedisModule`

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@gaosong886/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      port: 6379,
      host: 'localhost',
      db: 0,
    }),
  ],
  ...
})
export class AppModule {}
```

Inject the `RedisClient` into your class using the `@InjectRedis()` decorator

```ts
import { Injectable } from '@nestjs/common';
import { InjectRedis, RedisClient } from '@gaosong886/nestjs-redis';

@Injectable()
export class MyService {
  constructor(
    @InjectRedis() private readonly redisClient: RedisClient,
  ) {}

  async getSomething(): Promise<string> {
    return await this.redisClient.get('myKey');
  }
}
```

## Cluster & Multi instance

Some projects may require multiple redis connections, which can also be achieved using this module. In this case, the `name` of the instance becomes a mandatory field.

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@gaosong886/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      name: 'instance-1',
      port: 6379,
      host: '192.168.1.1',
      db: 0,
    }),

    // async passing options 
    RedisModule.forRootAsync({
      name: 'instance-2',
      useFactory: async () => {
        return {
          port: 6380,
          host: '192.168.1.2',
          db: 1,
        };
      },
    }),

    // cluster
    RedisModule.forRoot({
      name: 'cluster',
      nodes: [
        {
          port: 6380,
          host: '127.0.0.1',
        },
        {
          port: 6381,
          host: '127.0.0.1',
        },
      ],
      options: {
        scaleReads: 'slave',
      },
      // see more about cluster options
      // https://github.com/redis/ioredis/blob/main/README.md#cluster
    }),
  ],
  ...
})
export class AppModule {}
```
You can inject the `RedisClient` for a given instance `name`

```ts
import { Injectable } from '@nestjs/common';
import { InjectRedis, RedisClient } from '@gaosong886/nestjs-redis';

@Injectable()
export class MyService {
  constructor(
    @InjectRedis('instance-1') private readonly instance1: RedisClient,
    @InjectRedis('instance-2') private readonly instance2: RedisClient,
    @InjectRedis('cluster') private readonly cluster: RedisClient,
  ) {}

  ...
}
```
