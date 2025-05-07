// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from '../../../presentation/controllers/AuthController';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/UserRepositoryImpl';
import { LoginUseCase } from '../auth/LoginUseCase';
import { RegisterUseCase } from '../auth/RegisterUseCase';

@Module({
  imports: [],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: LoginUseCase,
      useFactory: (userRepository: UserRepositoryImpl) => new LoginUseCase(userRepository),
      inject: ['UserRepository'],
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
