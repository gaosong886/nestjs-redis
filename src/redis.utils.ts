import { DEFAULT_INSTANCE_NAME } from './redis.constants';

export function getInjectToken(name?: string): string {
  return `${name ? name : DEFAULT_INSTANCE_NAME}InjectToken`;
}
