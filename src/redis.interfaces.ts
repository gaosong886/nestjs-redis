import { ModuleMetadata, Type } from '@nestjs/common';
import { RedisOptions, ClusterNode, ClusterOptions } from 'ioredis';
import Redis, { Cluster } from 'ioredis';

export type RedisClient = Redis | Cluster;
export type RedisModuleOptions = RedisNodeOptions | RedisClusterOptions;

export interface RedisNodeOptions extends RedisOptions {
  isGlobal?: boolean;
  name?: string;
}

export interface RedisClusterOptions {
  isGlobal?: boolean;
  name?: string;

  // An array of nodes in the cluster.
  nodes: ClusterNode[];

  // Options for the Redis cluster.
  options?: ClusterOptions;
}

export interface RedisModuleOptionsFactory {
  createRedisModuleOptions(
    instanceName?: string,
  ): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  name?: string;

  // Use an existing RedisModuleOptionsFactory.
  useExisting?: Type<RedisModuleOptionsFactory>;

  // Use a class that extends RedisModuleOptionsFactory.
  useClass?: Type<RedisModuleOptionsFactory>;

  // Use a factory function that returns RedisModuleOptions.
  useFactory?: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;

  // An array of providers to be used in the module.
  inject?: any[];
}
