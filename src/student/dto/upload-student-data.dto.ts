import { IsEnum, IsNumber } from 'class-validator';
import { StudentDocumentType } from '../entities/studentFiles.entity';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UploadStudentDataDto {
  @ApiProperty({
    description: 'Student ID',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value, 10)) // Automatically converts string to number
  @IsNumber()
  studentId: number;
  @ApiProperty({
    description: 'Document type',
    example: 'grade-ten',
  })
  @IsEnum(StudentDocumentType, {
    message: `Invalid document type. Accepted values are: ${Object.values(StudentDocumentType).join(', ')}`,
  })
  documentType: StudentDocumentType;
}
