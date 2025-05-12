import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GetAllUsers } from '../../core/use-cases/user/GetAllUsersUseCase';
import { CreateUser } from '../../core/use-cases/user/CreateUserUseCase';
import { GetUserById } from '../../core/use-cases/user/GetUserByIdUseCase';
import { SearchUsers } from '../../core/use-cases/user/SearchUsersUseCase';
import { UpdateUser } from '../../core/use-cases/user/UpdateUserUseCase';
import { DeleteUser } from '../../core/use-cases/user/DeleteUserUseCase';
import { User } from '../../core/entities/User';
import { CreateUserDto } from '../dto/user/CreateUserDto';
import { SearchUserDto } from '../dto/user/SearchUserDto';
import { UpdateUserDto } from '../dto/user/UpdateUserDto';
import Logger from '../../shared/utils/Logger';  // Đảm bảo import đúng Logger
import { Roles } from 'src/shared/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { RolesGuard } from 'src/shared/auth/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly getAllUsers: GetAllUsers,
    private readonly createUser: CreateUser,
    private readonly getUserById: GetUserById,
    private readonly searchUsers: SearchUsers,
    private readonly updateUser: UpdateUser,
    private readonly deleteUser: DeleteUser,
  ) { }

   // Cấu hình route chỉ cho phép 'admin' truy cập
   @Get('admin')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   getAdminUsers() {
     return 'Admin users only'
   }
 
   // Cấu hình route chỉ cho phép 'student' truy cập
   @Get('student')
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('student')
   getStudentUsers() {
     return 'Student users only'
   }
  @Get()
  async getUsers(): Promise<User[]> {
    try {
      const users = await this.getAllUsers.execute();
      Logger.log('Fetched all users');
      return users;
    } catch (error) {
      Logger.error('Failed to retrieve users: ' + error.message);
      throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  async search(@Query() query: SearchUserDto): Promise<User[]> {
    Logger.log('Search query received: ' + JSON.stringify(query)); 
    try {
      const users = await this.searchUsers.execute(query);
      Logger.log(`Found ${users.length} users matching search criteria.`);
      return users;
    } catch (error) {
      Logger.error('Error during search: ' + error.message);
      throw new HttpException('Search failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async CreateUser(@Body() body: CreateUserDto): Promise<User> {
    try {
      Logger.log('Received body to create user: ' + JSON.stringify(body));  // Log the received body
      const user = await this.createUser.execute(body);
      Logger.log('User created successfully: ' + user.id);
      return user;
    } catch (error) {
      Logger.error('Failed to create user: ' + error.message);
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async GetUserById(@Param('id') id: string): Promise<User> {
    try {
      Logger.log(`Fetching user by ID: ${id}`);
      const user = await this.getUserById.execute(id);
      if (!user) {
        Logger.warn(`User not found: ${id}`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      Logger.error(`Failed to retrieve user with ID ${id}: ${error.message}`);
      throw new HttpException('Failed to retrieve user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id') // hoặc @Put(':id')
  async UpdateUser(
    @Param('id') id: string,
    @Body() userData: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    try {
      Logger.log(`Updating user with ID: ${id}`);
      const user = await this.updateUser.execute(id, userData);
      if (!user) {
        Logger.warn(`User not found for update: ${id}`);
      }
      return user;
    } catch (error) {
      Logger.error(`Failed to update user with ID ${id}: ${error.message}`);
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/delete')
  async updateIsDeleted(@Param('id') id: string): Promise<User | null> {
    try {
      Logger.log(`Deleting user with ID: ${id}`);
      const user = await this.deleteUser.execute(id);
      if (!user) {
        Logger.warn(`User not found for deletion: ${id}`);
      }
      return user;
    } catch (error) {
      Logger.error(`Failed to delete user with ID ${id}: ${error.message}`);
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
