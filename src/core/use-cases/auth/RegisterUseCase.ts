import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../interfaces/UserRepository';  // Import UserRepository
import { RegisterDto } from '../../../presentation/dto/auth/RegisterAuthDto';
import { User } from '../../entities/User';  // Import User entity
import * as bcrypt from 'bcrypt';  // Để hash mật khẩu

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(registerDto: RegisterDto): Promise<User> {
    // Hash mật khẩu trước khi lưu vào database

    // Tạo người dùng mới
    const newUser: Omit<User, 'id'> = {
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      role: 'student',
      isDeleted: false,
    };
     Logger.log('Registering new user:', newUser);
    // Lưu vào database
    const createdUser = await this.userRepository.create(newUser);
    return createdUser;
  }
}
