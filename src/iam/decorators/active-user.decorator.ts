import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constant';
import { CurrentUser } from '../types/current-user.type';

export const ActiveUser = createParamDecorator(
  (field: keyof CurrentUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentUser | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
