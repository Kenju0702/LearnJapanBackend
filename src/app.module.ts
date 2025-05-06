import { Module, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/databases/Database';
import { UserController } from './presentation/controllers/UserController';
import { GetAllUsers } from './core/use-cases/GetAllUsersUseCase';
import { CreateUser } from './core/use-cases/CreateUserUseCase';
import{ GetUserById } from './core/use-cases/GetUserByIdUseCase';
import{ SearchUsers } from './core/use-cases/SearchUsersUseCase';
import { UpdateUser } from './core/use-cases/UpdateUserUseCase';
import { DeleteUser } from './core/use-cases/DeleteUserUseCase';
import { UserRepositoryImpl } from './infrastructure/repositories/UserRepositoryImpl';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
  controllers: [UserController], // Đăng ký UserController
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: GetAllUsers,
      useFactory: (userRepository: UserRepositoryImpl) => new GetAllUsers(userRepository),
      inject: ['UserRepository'], // Inject UserRepository vào use-case
    }, {
      provide: CreateUser,
      useFactory: (userRepository: UserRepositoryImpl) => new CreateUser(userRepository),
      inject: ['UserRepository'], // Inject UserRepository vào use-case
    },
    {
      provide: SearchUsers,
      useFactory: (userRepository: UserRepositoryImpl) => new SearchUsers(userRepository),
      inject: ['UserRepository'], // Inject UserRepository vào use-case
    },
    {
      provide: GetUserById,
      useFactory: (userRepository: UserRepositoryImpl) => new GetUserById(userRepository),
      inject: ['UserRepository'], // Inject UserRepository vào use-case
    },
    {
      provide: UpdateUser,
      useFactory: (userRepository: UserRepositoryImpl) => new UpdateUser(userRepository),
      inject: ['UserRepository'], // Inject UserRepository vào use-case
    },
    {
      provide: DeleteUser,
      useFactory: (userRepository: UserRepositoryImpl) => new DeleteUser(userRepository),
      inject: ['UserRepository'], // Inject UserRepository vào use-case
    },
   
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    const uri = this.configService.get<string>('MONGO_URI');
    if (!uri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    console.log('Testing MongoDB connection with URI:', uri);

    try {
      await mongoose.connect(uri);
      console.log('MongoDB connected successfully!');

      // Kiểm tra trạng thái kết nối trước khi seed
      if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB connection is not ready. Seeding aborted.');
        return;
      }

      // Bạn có thể gọi seeder ở đây nếu cần
      // const userSeeder = new UserSeeder(new UserRepositoryImpl());
      // await userSeeder.onModuleInit();
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
}