import { User } from '../entities/User';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>; // Không yêu cầu `id` khi tạo
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}