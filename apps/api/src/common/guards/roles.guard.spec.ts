import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

describe('RolesGuard', () => {
  it('blocks when user is not admin', () => {
    const reflector = new Reflector();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const guard = new RolesGuard(reflector);
    const context = new ExecutionContextHost([{ user: { isAdmin: false } }]);
    expect(() => guard.canActivate(context as any)).toThrow();
  });
});
