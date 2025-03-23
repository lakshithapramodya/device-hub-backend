import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsEmail, IsNotEmpty, IsOptional} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'The email address of the admin or user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '7qm@*pp*7J',
    description:
      'A secure password that meets the complexity requirements: at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: false,
    description: 'Remember me feature, a boolean flag indicating whether to keep the user logged in.',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isRemember: boolean;
}
