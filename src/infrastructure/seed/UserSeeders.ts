import { Injectable, OnModuleInit } from '@nestjs/common';
import { SeedUsers } from '../../core/use-cases/user/SeedUsersUseCase';
import { UserRepositoryImpl } from '../repositories/UserRepositoryImpl';

@Injectable()
export class UserSeeder implements OnModuleInit {
  private readonly seedUsers: SeedUsers;

  constructor(private readonly userRepository: UserRepositoryImpl) {
    this.seedUsers = new SeedUsers(this.userRepository);
  }

  async onModuleInit() {
    console.log('Seeding sample users...');
    await this.seedUsers.execute();
  }
}