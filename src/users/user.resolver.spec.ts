import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';


describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  const mockUserService = {
    findById: jest.fn((id: string) => ({ id, email: 'test@example.com', pseudo: 'test', name: 'Test User', password: 'password' })),
    create: jest.fn((email: string, pseudo: string, name: string, password: string) => {
      if (!email.includes('@')) {
        throw new Error('Invalid user data');
      }
      return { id: '1', email, pseudo, name, password };
    }),
    update: jest.fn((id: string, email: string | null, pseudo: string | null, name: string | null) => ({ id, email, pseudo, name, password: 'password' })),
    delete: jest.fn((id: string) => true),
    logIn: jest.fn((email: string, password: string) => 'token'),
    getAllConversations: jest.fn(() => []),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should get a user by id', () => {
    const id = '1';
    expect(resolver.getUserById(id)).toEqual({
      id,
      email: 'test@example.com',
      pseudo: 'test',
      name: 'Test User',
      password: 'password',
    });
    expect(service.findById).toHaveBeenCalledWith(id);
  });

  it('should create a user', () => {
    const email = 'test@example.com';
    const pseudo = 'test';
    const name = 'Test User';
    const password = 'password';
    expect(resolver.createUser(email, pseudo, name, password)).toEqual({
      id: '1',
      email,
      pseudo,
      name,
      password,
    });
    expect(service.create).toHaveBeenCalledWith(email, pseudo, name, password);
  });

  it('should return an error for invalid user data', () => {
    const email = 'invalid-email';
    const pseudo = 'test';
    const name = 'Test User';
    const password = 'password';
    expect(() => resolver.createUser(email, pseudo, name, password)).toThrow('Invalid user data');
  });

  it('should update a user', () => {
    const id = '1';
    const email = 'updated@example.com';
    const pseudo = 'updated';
    const name = 'Updated User';
    expect(resolver.updateUser(id, email, pseudo, name)).toEqual({
      id,
      email,
      pseudo,
      name,
      password: 'password',
    });
    expect(service.update).toHaveBeenCalledWith(id, email, pseudo, name);
  });

  it('should delete a user', () => {
    const id = '1';
    expect(resolver.deleteUser(id)).toEqual(true);
    expect(service.delete).toHaveBeenCalledWith(id);
  });

  it('should log in a user', () => {
    const email = 'test@example.com';
    const password = 'password';
    expect(resolver.logIn(email, password)).toEqual('token');
    expect(service.logIn).toHaveBeenCalledWith(email, password);
  });

  it('should get all conversations for a user', () => {
    const userId = '1';
    expect(resolver.getAllConversations(userId)).toEqual([]);
    expect(service.getAllConversations).toHaveBeenCalledWith(userId);
  });
});
