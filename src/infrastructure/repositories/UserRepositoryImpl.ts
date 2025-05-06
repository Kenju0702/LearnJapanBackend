import { UserRepository } from '../../core/interfaces/UserRepository';
import { User } from '../../core/entities/User';
import UserModel from '../databases/UserModel';
import * as bcrypt from 'bcrypt';
import { SearchUserDto } from '../../presentation/dto/user/SearchUserDto' // Import DTO cho CreateUser

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
        user.role === "admin" ? "student" : user.role
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
      user.role === "admin" ? "student" : user.role,
      user.isDeleted,
    );
  }

  async search(query: SearchUserDto): Promise<any> {
    const {
      id,
      email,
      name,
      role,
      isDeleted,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const filter: any = {};

    if (id) filter._id = id;
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (role) filter.role = role;
    if (isDeleted !== undefined) filter.isDeleted = isDeleted;
    const skip = (pageNumber - 1) * limitNumber;
    const sort: any = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const totalCount = await UserModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNumber);

    // Sử dụng `select` để chỉ lấy các trường cần thiết, giúp giảm độ phức tạp của query
    const results = await UserModel.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort(sort)
      .select('name email role isDeleted'); // Chỉ lấy trường cần thiết để giảm bớt dữ liệu trả về

    return {
      totalCount,
      totalPages,
      page: pageNumber,
      limit: limitNumber,
      data: results.map(u =>
        new User(
          u._id.toString(),
          u.name,
          u.email,
          u.password,
          u.role as 'student' |  'admin',
          u.isDeleted,
        )
      ),
    };
  }

  async findByEmail(email: string): Promise<boolean> {
    try {
      console.log('Searching for user by email:', email); // Kiểm tra email trước khi tìm kiếm
      const result = await this.search({ email });
      const [user] = result.data;
      console.log('User found:', user ? user : 'No user found'); // Kiểm tra người dùng đã tìm thấy hay chưa
      if (!user) {
        return false;
      }

      return true;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }


  async create(user: Omit<User, 'id'>): Promise<User> {
    // Kiểm tra dữ liệu người dùng trước khi tạo
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await UserModel.create({ ...user, password: hashedPassword });
    return new User(
      createdUser._id.toString(),
      createdUser.name,
      createdUser.email,
      createdUser.password,
      createdUser.role as 'student' | 'admin',
      createdUser.isDeleted || false // Giả sử trường này có trong model
    );
  }


  async update(id: string, user: Partial<User>): Promise<User | null> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10)
    }
    const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true });
    if (!updatedUser) return null;
    return new User(
      updatedUser._id.toString(),
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
      updatedUser.role === "admin" ? "student" : updatedUser.role,
      updatedUser.isDeleted || false
    );
  }

  async delete(id: string): Promise<User | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(id,
      { isDeleted: true }, // đánh dấu người dùng là đã xóa
      { new: true }
    );

    if (!updatedUser) return null;

    return new User(
      updatedUser._id.toString(),
      updatedUser.name,
      updatedUser.email,
      updatedUser.password, // mật khẩu không thay đổi
      updatedUser.role === "admin" ? "student" : updatedUser.role,
      updatedUser.isDeleted === true,
    );
  }

}
