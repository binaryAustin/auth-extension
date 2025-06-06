import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Policy } from '../policies/types/policy.type';
import { POLICIES_KEY, REQUEST_USER_KEY } from 'src/iam/iam.constant';
import { CurrentUserInfo } from 'src/iam/types/current-user-info.type';
import { PolicyHandlerStorage } from '../policies/policy-handlers.storage';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyHandlerStorage: PolicyHandlerStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies = this.reflector.getAllAndOverride<Policy[]>(POLICIES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!policies) return true;

    const user: CurrentUserInfo = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    await Promise.all(
      policies.map((policy) => {
        const policyHandler = this.policyHandlerStorage.get(
          policy.constructor as Type,
        );
        return policyHandler?.handle(policy, user);
      }),
    ).catch((err) => {
      throw new ForbiddenException(err.message);
    });

    return true;
  }
}
