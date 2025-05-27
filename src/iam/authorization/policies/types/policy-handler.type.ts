import { CurrentUser } from '../../../types/current-user.type';
import { Policy } from './policy.type';

export interface PolicyHandler<T extends Policy> {
  handle(policy: T, user: CurrentUser): Promise<void>;
}
