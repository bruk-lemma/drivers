import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';
import { Role } from 'src/users/entities/role.entity';

export class SignUpDto {
  @ApiProperty({
    description: 'User email',
    example: 'admin@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @MinLength(10)
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 1,
  })
  roleId: number;
}
