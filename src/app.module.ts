import { Module, OnModuleInit } from '@nestjs/common';
import mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/databases/Database';
import { UserSeeder } from './infrastructure/seed/UserSeeders';
import { UserRepositoryImpl } from './infrastructure/repositories/UserRepositoryImpl';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

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
  
      // const userSeeder = new UserSeeder(new UserRepositoryImpl());
      // await userSeeder.onModuleInit();
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  }
}