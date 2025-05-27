import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/enums/role.enum';
import { ROLES_KEY } from 'src/iam/iam.constant';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
