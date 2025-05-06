import { UserRepository } from '../interfaces/UserRepository'
import { User } from '../entities/User'
export class SearchUsers {
    constructor(private readonly userRepository: UserRepository) {}
  
    async execute(query: any): Promise<User[]> {
      return await this.userRepository.search(query)
    }
  }