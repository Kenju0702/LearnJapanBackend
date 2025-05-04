import { UserRepository } from '../interfaces/UserRepository';

export class SeedUsers {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(): Promise<void> {
        const sampleUsers = [
            { name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role: 'student' as const },
            { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password456', role: 'instructor' as const },
        ];
    
        for (const user of sampleUsers) {
            const createdUser = await this.userRepository.create(user);
            console.log(`Seeded user: ${createdUser.id} - ${createdUser.name}`);
        }
    
        console.log('Sample users seeded successfully!');
    }
}