import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '../dto/auth/LoginAuthDto';  // Đảm bảo import đúng DTO
import { RegisterDto } from '../dto/auth/RegisterAuthDto';  // Đảm bảo import đúng DTO
import Logger from '../../shared/utils/Logger';
import { LoginUseCase } from 'src/core/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from 'src/core/use-cases/auth/RegisterUseCase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      Logger.log('Login request received for email: ' + loginDto.email);
      const token = await this.loginUseCase.execute(loginDto);  // pass DTO directly
      return { token };
    } catch (error) {
      Logger.error('Login failed for email: ' + loginDto.email + ' Error: ' + error.message);
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      Logger.log('Registration request received for email: ' + registerDto.email);
      const user = await this.registerUseCase.execute(registerDto);
      return { user };
    } catch (error) {
      Logger.error('Registration failed for email: ' + registerDto.email + ' Error: ' + error.message);
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }
  }
}

