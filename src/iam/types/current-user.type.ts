import { Role } from 'src/users/enums/role.enum';
import { PermissionType } from '../authorization/types/permission.type';

export interface CurrentUser {
  sub: number;
  email: string;
  role: Role;
  permissions: PermissionType[];
}
