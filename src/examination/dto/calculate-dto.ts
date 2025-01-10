import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CalculateDto {
  @ApiProperty({
    type: Number,
    description: 'The ID of the question',
    example: 1,
  })
  @IsNumber()
  id: number;
  @ApiProperty({
    type: String,
    description: 'The answer to the question',
    example: 'choice1',
  })
  @IsString()
  answer: string;
}
