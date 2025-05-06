import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { GetAllUsers } from '../../core/use-cases/GetAllUsersUseCase'
import { CreateUser } from '../../core/use-cases/CreateUserUseCase'
import { GetUserById } from '../../core/use-cases/GetUserByIdUseCase'
import { SearchUsers } from '../../core/use-cases/SearchUsersUseCase'
import { UpdateUser } from '../../core/use-cases/UpdateUserUseCase'
import { DeleteUser } from '../../core/use-cases/DeleteUserUseCase'
import { User } from '../../core/entities/User'
import { CreateUserDto } from '../dto/user/CreateUserDto'
import { SearchUserDto } from '../dto/user/SearchUserDto'
import { UpdateUserDto } from '../dto/user/UpdateUserDto'

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

  @Get()
  async getUsers(): Promise<User[]> {
    try {
      const users = await this.getAllUsers.execute()
      return users
    } catch (error) {
      throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  @Get('search')
  async search(@Query() query: SearchUserDto): Promise<User[]> {
    console.log('Query received:', query);  // Kiểm tra query sau khi đã parse qua DTO
    return await this.searchUsers.execute(query);
  }


  @Post()
  async CreateUser(@Body() body: CreateUserDto): Promise<User> {
    try {
      console.log('Received body:', body); // Kiểm tra body sau khi đã parse qua DTO
      const user = await this.createUser.execute(body); // Gọi use-case CreateUser
      return user;
    } catch (error) {
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @Get(':id')
  async GetUserById(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.getUserById.execute(id)
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }
      return user
    } catch (error) {
      throw new HttpException('Failed to retrieve user', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  @Patch(':id') // hoặc @Put(':id')
  async UpdateUser(
    @Param('id') id: string,
    @Body() userData: Partial<UpdateUserDto>,
  ): Promise<User | null> {
    return await this.updateUser.execute(id, userData);
  }
  
  @Patch(':id/delete')
  async updateIsDeleted( @Param('id') id: string ): Promise<User | null> {
    const user = await this.deleteUser.execute(id); // Chỉ truyền id
    return user;
  }
  



}
