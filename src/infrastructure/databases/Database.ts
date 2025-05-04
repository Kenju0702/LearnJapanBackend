// src/infrastructure/databases/database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule, // để đọc .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        console.log('MONGO_URI:', uri);

        // Lắng nghe sự kiện kết nối
        mongoose.connection.on('connected', () => {
          console.log('MongoDB connected successfully!');
        });

        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });

        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          connectTimeoutMS: 20000,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
