import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SignUpResponseDto {
  @ApiProperty({
    description: 'User id',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'User email',
    example: 'admin@gmail.com',
  })
  @Expose()
  email: string;
}
