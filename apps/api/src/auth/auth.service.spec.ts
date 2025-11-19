import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn()
  } as unknown as UsersService;
  const jwtService = { sign: jest.fn(() => 'token') } as unknown as JwtService;
  const service = new AuthService(usersService, jwtService);

  it('rejects invalid password', async () => {
    usersService.findByEmail = jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('secret', 1)
    });

    await expect(service.login({ email: 'test@example.com', password: 'bad' })).rejects.toThrow();
  });
});
