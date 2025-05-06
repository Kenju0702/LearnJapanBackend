import { IsOptional, IsString, IsEmail, IsEnum, IsNumberString } from 'class-validator'

export class SearchUserDto {
  @IsOptional()
  @IsString()
  id?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsEnum(['student',  'admin'], {
    message: 'Role must be student, instructor or admin',
  })
  role?: 'student' | 'admin'
  isDeleted?: boolean

  @IsOptional()
  @IsNumberString()
  page?: string

  @IsOptional()
  @IsNumberString()
  limit?: string

  @IsOptional()
  @IsString()
  sortBy?: string

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Order must be asc or desc' })
  order?: 'asc' | 'desc'
}
