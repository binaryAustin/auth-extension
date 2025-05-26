import { Role } from 'src/users/enums/role.enum';

export interface UserInfoPayload {
  sub: number;
  email: string;
  role: Role;
}
