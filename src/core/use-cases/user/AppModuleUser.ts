import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/UserRepositoryImpl';
import { GetAllUsers } from './GetAllUsersUseCase';
import { CreateUser } from './CreateUserUseCase';
import { GetUserById } from './GetUserByIdUseCase';
import { SearchUsers } from './SearchUsersUseCase';
import { UpdateUser } from './UpdateUserUseCase';
import { DeleteUser } from './DeleteUserUseCase';

@Module({
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: GetAllUsers,
      useFactory: (userRepository: UserRepositoryImpl) => new GetAllUsers(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: CreateUser,
      useFactory: (userRepository: UserRepositoryImpl) => new CreateUser(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: SearchUsers,
      useFactory: (userRepository: UserRepositoryImpl) => new SearchUsers(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: GetUserById,
      useFactory: (userRepository: UserRepositoryImpl) => new GetUserById(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUser,
      useFactory: (userRepository: UserRepositoryImpl) => new UpdateUser(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: DeleteUser,
      useFactory: (userRepository: UserRepositoryImpl) => new DeleteUser(userRepository),
      inject: ['UserRepository'],
    },
  ],
  exports: [
    GetAllUsers,
    CreateUser,
    GetUserById,
    SearchUsers,
    UpdateUser,
    DeleteUser,
  ],
})
export class UserUseCasesModule {}
