import { UserRepository } from '../../interfaces/UserRepository'
import { User } from '../../entities/User'
export class UpdateUser {
    constructor(private readonly userRepository: UserRepository) { }
    async execute(id: string, user: Partial<User>): Promise<User | null> {
        // Kiểm tra xem người dùng có tồn tại không
        const existingUser = await this.userRepository.findById(id)
        if (!existingUser) {
            throw new Error('User not found')
        }
        const { id: _, ...safeUser } = user;
        const updatedUser = await this.userRepository.update(id, safeUser);
        return updatedUser
    }
}