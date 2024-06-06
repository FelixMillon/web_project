import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User } from './user.model';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  const mockUser = {
    id: '1',
    email: 'toto@gmail.com',
    pseudo: 'toto',
    name: 'toto',
    password: 'Azerty@123',
  };

  const mockUsersService = {
    create: jest.fn().mockImplementation((user: Partial<User>) => {
      return {
        id: '1',
        ...user,
      };
    }),
    findOneByEmail: jest.fn().mockImplementation((email: string) => {
      return mockUser.email === email ? mockUser : null;
    }),
  };

  const mockAuthService = {
    validateUser: jest.fn().mockImplementation((email: string, password: string) => {
      return email === mockUser.email && password === mockUser.password ? mockUser : null;
    }),
    login: jest.fn().mockImplementation((user: User) => {
      return { access_token: 'fake-jwt-token' };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const userDto = {
        email: 'toto@gmail.com',
        pseudo: 'toto',
        name: 'toto',
        password: 'Azerty@123',
      };
      expect(await usersController.createUser(userDto)).toEqual({
        id: '1',
        ...userDto,
      });
      expect(usersService.create).toHaveBeenCalledWith(userDto);
    });

    it('should return an error for invalid user data', async () => {
      const invalidUserDto = {
        email: 'invalid-email',
        pseudo: 'toto',
        name: 'toto',
        password: 'Azerty@123',
      };
      mockUsersService.create.mockImplementationOnce(() => {
        throw new Error('Invalid user data');
      });
      await expect(usersController.createUser(invalidUserDto)).rejects.toThrow('Invalid user data');
    });
  });

  describe('loginUser', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginDto = { email: 'toto@gmail.com', password: 'Azerty@123' };
      expect(await usersController.loginUser(loginDto)).toEqual({ access_token: 'fake-jwt-token' });
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      const loginDto = { email: 'toto@gmail.com', password: 'wrongpassword' };
      await expect(usersController.loginUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      expect(await usersController.findOneByEmail('toto@gmail.com')).toEqual(mockUser);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith('toto@gmail.com');
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findOneByEmail.mockReturnValueOnce(null);
      expect(await usersController.findOneByEmail('notfound@example.com')).toBeNull();
      expect(usersService.findOneByEmail).toHaveBeenCalledWith('notfound@example.com');
    });
  });
});
