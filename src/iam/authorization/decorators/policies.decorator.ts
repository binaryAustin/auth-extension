import { SetMetadata } from '@nestjs/common';
import { Policy } from '../policies/types/policy.type';
import { POLICIES_KEY } from 'src/iam/iam.constant';

export const Policies = (...policies: Policy[]) =>
  SetMetadata(POLICIES_KEY, policies);
