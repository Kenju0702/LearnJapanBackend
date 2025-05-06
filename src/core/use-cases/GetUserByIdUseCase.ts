import { UserRepository } from '../interfaces/UserRepository'
import { User } from '../entities/User'
export class GetUserById {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findById(id)
      return user
    } catch (error) {
      throw new Error('Failed to retrieve user: ' + error.message)
    }
  }
}