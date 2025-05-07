import { User } from '../entities/User';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  search(query: any): Promise<User[]>;
  create(user: Omit<User, 'id'>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<User | null>;

}