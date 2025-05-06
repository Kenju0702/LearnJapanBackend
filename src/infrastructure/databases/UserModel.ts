import mongoose from 'mongoose';
import validator from 'validator';
import * as bcrypt from 'bcrypt';

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          // Kiểm tra email có hợp lệ không
          return validator.isEmail(v);
        },
        message: (props: any) => `${props.value} is not a valid email!`
      }
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], required: true },
    isDeleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);

// Mã hóa mật khẩu trước khi lưu vào MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);  // Hash mật khẩu với 10 rounds
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu đã hash với mật khẩu người dùng nhập vào
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error('Password comparison failed');
  }
};

// Loại bỏ mật khẩu khỏi đối tượng khi trả về
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password; // Loại bỏ trường password trước khi trả về
  return userObject;
};

// Đảm bảo không trả về lỗi về mật khẩu trong trường hợp không hợp lệ
userSchema.post('save', function (doc) {
  // Bạn có thể thực hiện các xử lý sau khi lưu dữ liệu, chẳng hạn như logging, audit,...
  console.log(`User ${doc.email} has been saved successfully!`);
});

export default mongoose.model('User', userSchema);
