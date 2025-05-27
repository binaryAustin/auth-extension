import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { AuthType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/iam/iam.constant';
import { ApiKeyGuard } from './api-key.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const authTypeGuardMap = this.getAuthTypeGuardMap();
    const guards = authTypes.map((type) => authTypeGuardMap[type]).flat();

    let error = new UnauthorizedException();

    for (const guard of guards) {
      const canActivate = await Promise.resolve(
        guard.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      if (canActivate) return true;
    }

    throw error;
  }

  getAuthTypeGuardMap(): Record<AuthType, CanActivate | CanActivate[]> {
    return {
      [AuthType.ApiKey]: this.apiKeyGuard,
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }
}
