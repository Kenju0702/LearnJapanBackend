import { Module } from '@nestjs/common';
import { AuthController } from '../presentation/controllers/AuthController';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { LoginUseCase } from '../core/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '../core/use-cases/auth/RegisterUseCase';
import { JwtModule, JwtService } from '@nestjs/jwt';  // Import JwtModule
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/shared/auth/jwt.strategy';
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },  // Token hết hạn sau 1 giờ
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: LoginUseCase,
      useFactory: (userRepository: UserRepositoryImpl, jwtService: JwtService) => new LoginUseCase(userRepository, jwtService),
      inject: ['UserRepository', JwtService],
    },
    {
      provide: RegisterUseCase,
      useFactory: (userRepository: UserRepositoryImpl) => new RegisterUseCase(userRepository),
      inject: ['UserRepository'],
    },
  ],
  controllers: [AuthController],
  exports: [LoginUseCase, RegisterUseCase],
})
export class AuthUseCaseAppModule {}