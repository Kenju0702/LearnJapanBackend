import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsString({ message: 'Role must be a string' })
  @IsEnum(['student', 'instructor'], { message: 'Role must be either student or instructor' })
  role: 'student' | 'instructor'| 'admin';
}
