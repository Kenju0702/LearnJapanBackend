import { Module, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/databases/Database';
import { UserController } from './presentation/controllers/UserController';
import { UserUseCasesModule } from './core/use-cases/user/AppModuleUser';
import { AuthUseCaseAppModule } from './core/use-cases/auth/AppModuleAuth';
import { AuthController } from './presentation/controllers/AuthController';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,UserUseCasesModule,AuthUseCaseAppModule, // Đăng ký module chứa các use-case
  ],
  controllers: [UserController,AuthController], // Đăng ký UserController

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