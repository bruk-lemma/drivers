import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class QuestionsResponseDto {
  // Add the following properties:
  @ApiProperty({
    description: 'The id of the question',
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The description of the question',
    type: String,
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'The first choice of the question',
    type: String,
  })
  @Expose()
  choice1: string;

  @ApiProperty({
    description: 'The second choice of the question',
    type: String,
  })
  @Expose()
  choice2: string;

  @ApiProperty({
    description: 'The third choice of the question',
    type: String,
  })
  @Expose()
  choice3: string;

  @ApiProperty({
    description: 'The fourth choice of the question',
    type: String,
  })
  @Expose()
  choice4: string;

  @ApiProperty({
    description: 'The answer of the question',
    type: String,
  })
  @Expose()
  answer: string;

  @ApiProperty({
    description: 'The image of the question',
    type: String,
  })
  @Expose()
  image: string;
}
