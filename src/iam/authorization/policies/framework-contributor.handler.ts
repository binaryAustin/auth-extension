import { PolicyHandler } from 'src/iam/authorization/policies/types/policy-handler.type';
import { FrameworkContributorPolicy } from './framework-contributor.policy';
import { CurrentUser } from 'src/iam/types/current-user.type';
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
    user: CurrentUser,
  ): Promise<void> {
    const isContributor = user.email.endsWith('@nestjs.com');
    if (!isContributor) throw new Error('User is not a contributor');
  }
}
