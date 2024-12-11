import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDto {
  @ApiProperty({
    description: 'The token sent to the user email',
    type: String,
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
