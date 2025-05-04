import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common'
import { GetAllUsers } from '../../core/use-cases/GetAllUsers'
import { User } from '../../core/entities/User'

@Controller('users')
export class UserController {
  constructor(
    private readonly getAllUsers: GetAllUsers,
  ) {}

  @Get()
  async getUsers(): Promise<User[]> {
    try {
      const users = await this.getAllUsers.execute()
      return users
    } catch (error) {
      throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
