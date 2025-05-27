import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../types/permission.type';
import { PERMISSIONS_KEY } from '../../iam.constant';

export const Permissions = (...permissions: PermissionType[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
