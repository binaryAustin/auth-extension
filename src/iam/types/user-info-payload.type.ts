import { Role } from 'src/users/enums/role.enum';
import { PermissionType } from './permission.type';

export interface UserInfoPayload {
  sub: number;
  email: string;
  role: Role;
  permissions: PermissionType[];
}
