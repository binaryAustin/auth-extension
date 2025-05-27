import { PassportSerializer } from '@nestjs/passport';
import { CurrentUserInfo } from 'src/iam/types/current-user-info.type';
import { User } from 'src/users/entities/user.entity';

export class UserSerializer extends PassportSerializer {
  serializeUser(
    user: User,
    done: (err: Error | null, user: CurrentUserInfo) => void,
  ) {
    done(null, {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });
  }

  async deserializeUser(
    payload: CurrentUserInfo,
    done: (err: Error | null, user: CurrentUserInfo) => void,
  ) {
    done(null, payload);
  }
}
