import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../interfaces/UserRepository';  // Import UserRepository
import { LoginDto } from '../../../presentation/dto/auth/LoginAuthDto';
import * as bcrypt from 'bcrypt';  // Để so sánh mật khẩu

@Injectable()
export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(loginDto: LoginDto): Promise<string> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Tạo và trả về token sau khi xác thực thành công
    return 'generated-jwt-token';  
  }
}
