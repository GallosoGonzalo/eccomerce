import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PolicyHandler } from '../policies/policy.interface';

export const POLICIES_KEY = 'policies';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handlers =
      this.reflector.getAllAndOverride<PolicyHandler[]>(POLICIES_KEY, [
        context.getHandler(),
        context.getClass()
      ]) || [];
    const { user } = context.switchToHttp().getRequest();

    return handlers.every((handler) => handler.handle(user));
  }
}
