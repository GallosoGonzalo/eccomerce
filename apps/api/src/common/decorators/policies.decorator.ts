import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../policies/policy.interface';
import { POLICIES_KEY } from '../guards/policies.guard';

export const Policies = (...handlers: PolicyHandler[]) =>
  SetMetadata(POLICIES_KEY, handlers);
