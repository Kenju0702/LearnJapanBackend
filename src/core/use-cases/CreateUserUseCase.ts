import { UserRepository } from '../interfaces/UserRepository';
import { User } from '../entities/User';

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(userData: Omit<User, 'id'>): Promise<User> {
    // Kiểm tra xem email đã tồn tại chưa
    console.log('Checking if email exists:', userData.email); // Kiểm tra email trước khi tìm kiếm
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
 
    // Kiểm tra mật khẩu có tồn tại không
    if (!userData.password) {
      throw new Error('Password is required');
    }

    // Tạo người dùng mới
    try {
      const user = await this.userRepository.create(userData);
      return user;
    } catch (error) {
      // Xử lý lỗi chi tiết hơn
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
      throw new Error('An unexpected error occurred');
    }
  }
}
