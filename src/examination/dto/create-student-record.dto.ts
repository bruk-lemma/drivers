import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum ExaminationType {
  PRACTICE = 'PRACTICE',
  FINAL = 'FINAL',
}
export class CreateStudentRecordDto {
  @ApiProperty({
    type: Number,
    description: 'The ID of the examination',
    example: 1,
  })
  score: number;
  //   @ApiProperty({
  //     type: String,
  //     description: 'The status of the examination',
  //     // example: 'PASS',
  //   })
  //   status: string;
  @ApiProperty({
    type: String,
    description: 'The description of the examination',
    example: 'Final examination',
  })
  description: string;
  @ApiProperty({
    type: String,
    description: 'The type of the examination',
    example: 'PRACTICE',
  })
  @IsEnum(ExaminationType, {
    message: `Invalid Exam type type. Accepted values are: ${Object.values(ExaminationType).join(', ')}`,
  })
  examType: string;
  @ApiProperty({
    type: Number,
    description: 'The ID of the student',
    example: 1,
  })
  studentId: number;
}
