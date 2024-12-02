import { IsEnum, IsNumber } from 'class-validator';
import { StudentDocumentType } from '../entities/studentFiles.entity';
import { Transform } from 'class-transformer';

export class UploadStudentDataDto {
  @Transform(({ value }) => parseInt(value, 10)) // Automatically converts string to number
  @IsNumber()
  studentId: number;
  @IsEnum(StudentDocumentType, {
    message: `fInvalid document type. Accepted values are: ${Object.values(StudentDocumentType).join(', ')}`,
  })
  documentType: StudentDocumentType;
}
