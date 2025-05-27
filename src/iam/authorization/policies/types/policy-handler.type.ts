import { CurrentUserInfo } from '../../../types/current-user-info.type';
import { Policy } from './policy.type';

export interface PolicyHandler<T extends Policy> {
  handle(policy: T, user: CurrentUserInfo): Promise<void>;
}
