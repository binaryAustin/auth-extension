import { PolicyHandler } from 'src/iam/authorization/policies/types/policy-handler.type';
import { FrameworkContributorPolicy } from './framework-contributor.policy';
import { CurrentUserInfo } from 'src/iam/types/current-user-info.type';
import { PolicyHandlerStorage } from './policy-handlers.storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FrameworkContributorHandler
  implements PolicyHandler<FrameworkContributorPolicy>
{
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(FrameworkContributorPolicy, this);
  }

  async handle(
    policy: FrameworkContributorPolicy,
    user: CurrentUserInfo,
  ): Promise<void> {
    const isContributor = user.email.endsWith('@nestjs.com');
    if (!isContributor) throw new Error('User is not a contributor');
  }
}
