import { IsEnum, IsNumber, IsString } from 'class-validator';
import { StudentDocumentType } from '../entities/studentFiles.entity';

export class StudentFileType {
  @IsNumber()
  studentId: number;
  @IsString()
  fileName: string;
  @IsString()
  filePath: string;
  @IsString()
  fileType: string;
  @IsString()
  fileSize: string;
  @IsString()
  @IsEnum(StudentDocumentType, {
    message: `Invalid document type. Accepted values are: ${Object.values(StudentDocumentType).join(', ')}`,
  })
  fileCategory: StudentDocumentType;
}
