import { UserRepository } from '../../core/interfaces/UserRepository';
import { User } from '../../core/entities/User';
import UserModel from '../databases/UserModel';
import * as bcrypt from 'bcrypt';

export class UserRepositoryImpl implements UserRepository {
  async findAll(): Promise<User[]> {
    // Lấy tất cả người dùng từ cơ sở dữ liệu
    const users = await UserModel.find();
    return users.map(user =>
      new User(
        user._id.toString(), // Convert ObjectId to string
        user.name,
        user.email,
        user.password,
        user.role === "admin" ? "instructor" : user.role
      )
    );
  }

  async createSampleUsers() {
    const sampleUsers = [
      { name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role: 'student' },
      { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password456', role: 'instructor' },
    ];

    // Thử dùng insertOne thay vì insertMany
    for (const user of sampleUsers) {
      await UserModel.create(user);
    }
  }



  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return new User(
      user._id.toString(),
      user.name,
      user.email,
      user.password,
      user.role === "admin" ? "instructor" : user.role
    );
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await UserModel.create({ ...user, password: hashedPassword });
    return new User(
      createdUser._id.toString(),
      createdUser.name,
      createdUser.email,
      createdUser.password,
      createdUser.role as 'student' | 'instructor' | 'admin', // Chuyển đổi kiểu
    );
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true });
    if (!updatedUser) return null;
    return new User(
      updatedUser._id.toString(),
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
      updatedUser.role === "admin" ? "instructor" : updatedUser.role
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }
}
