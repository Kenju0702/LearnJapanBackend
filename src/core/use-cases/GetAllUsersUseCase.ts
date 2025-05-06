import { UserRepository } from '../interfaces/UserRepository'
import { User } from '../entities/User'

export class GetAllUsers {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    try {
      const users = await this.userRepository.findAll()
      return users
    } catch (error) {
      throw new Error('Failed to retrieve users: ' + error.message)
    }
  }
}
