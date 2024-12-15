import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { SchoolFilesType } from '../entities/school-files.entity';

export class UploadDocDto {
  @ApiProperty({
    description: 'Student ID',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value, 10)) // Automatically converts string to number
  @IsNumber()
  schoolId: number;
  @ApiProperty({
    description: 'Document type',
    example: 'TIN',
  })
  @IsEnum(SchoolFilesType, {
    message: `Invalid document type. Accepted values are: ${Object.values(SchoolFilesType).join(', ')}`,
  })
  documentType: SchoolFilesType;
}
