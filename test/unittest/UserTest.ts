import { GetAllUsers } from '../GetAllUsers';
import { UserRepository } from '../../interfaces/UserRepository';
import { User } from '../../entities/User';

const mockUserRepository: UserRepository = {
  findAll: jest.fn().mockResolvedValue([
    new User('1', 'John Doe', 'john@example.com', 'password', 'student'),
  ]),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('GetAllUsers', () => {
  it('should return all users', async () => {
    const getAllUsers = new GetAllUsers(mockUserRepository);
    const users = await getAllUsers.execute();
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('John Doe');
  });
});