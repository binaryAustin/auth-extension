import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constant';
import { UserInfoPayload } from '../types/user-info-payload.type';

export const ActiveUser = createParamDecorator(
  (field: keyof UserInfoPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserInfoPayload | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
