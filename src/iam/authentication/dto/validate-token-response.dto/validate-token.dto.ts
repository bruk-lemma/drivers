import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ValidateTokenResponseDto {
  @ApiProperty({
    description: 'The token sent to the user email',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The user id',
  })
  @Expose()
  userId: number;
}
