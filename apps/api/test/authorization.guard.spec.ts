import { RolesGuard } from '../src/common/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

describe('Authorization policies', () => {
  it('denies mutation when user missing', () => {
    const reflector = new Reflector();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const guard = new RolesGuard(reflector);
    const context = new ExecutionContextHost([{}]);
    expect(() => guard.canActivate(context as any)).toThrow('Missing user context');
  });

  it('allows admin user to mutate resources', () => {
    const reflector = new Reflector();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const guard = new RolesGuard(reflector);
    const context = new ExecutionContextHost([{ user: { isAdmin: true } }]);
    expect(guard.canActivate(context as any)).toBe(true);
  });
});
