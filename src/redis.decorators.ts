import { Inject } from '@nestjs/common';
import { getInjectToken } from './redis.utils';

export const InjectRedis = (instanceName?: string): ReturnType<typeof Inject> =>
  Inject(getInjectToken(instanceName));
