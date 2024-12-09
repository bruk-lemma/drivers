import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The token sent to the user email',
    type: String,
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
  @ApiProperty({
    description: 'The new password',
    type: String,
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  newPassword: string;
  @ApiProperty({
    description: 'The user email',
    type: String,
    example: 'emial@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
