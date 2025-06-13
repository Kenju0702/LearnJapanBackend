import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../interfaces/UserRepository';
import { LoginDto } from '../../../presentation/dto/auth/LoginAuthDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';  // Import JwtService

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,  // Inject JwtService
  ) {}

  async execute(loginDto: LoginDto): Promise<string> {
    // Tìm người dùng qua email
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      Logger.warn(`User not found with email: ${loginDto.email}`);
      throw new Error('Invalid credentials');
    }

    // Kiểm tra mật khẩu nhập vào so với mật khẩu đã băm trong cơ sở dữ liệu
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      Logger.warn(`Invalid password attempt for email: ${loginDto.email}`);
      throw new Error('Invalid credentials');
    }

    // Tạo JWT token với payload (thông tin cần thiết trong token)
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    Logger.log(`payload: ${JSON.stringify(payload)}`);
    Logger.log(`Token created: ${token}`);
    return token;  // Trả về token đã tạo
  }
}
