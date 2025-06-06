import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/users/enums/role.enum';
import { REQUEST_USER_KEY, ROLES_KEY } from '../../iam.constant';
import { CurrentUserInfo } from '../../types/current-user-info.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRoles) return true;

    const user: CurrentUserInfo = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    return contextRoles.some((role) => user.role === role);
  }
}
