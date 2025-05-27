import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constant';
import { CurrentUserInfo } from '../types/current-user-info.type';

export const CurrentUser = createParamDecorator(
  (field: keyof CurrentUserInfo | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentUserInfo | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
