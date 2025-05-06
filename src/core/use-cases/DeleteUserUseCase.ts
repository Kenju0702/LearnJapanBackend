import { UserRepository } from '../interfaces/UserRepository'
import { User } from '../entities/User'

export class DeleteUser {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
    }

    // Xóa người dùng
    const updatedUser = await this.userRepository.delete(id);
    return updatedUser;
  }
}