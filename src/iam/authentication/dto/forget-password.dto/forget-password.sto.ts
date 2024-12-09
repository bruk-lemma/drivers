import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({
    description: 'The user email',
    type: String,
    example: 'email@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
