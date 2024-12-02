import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/student.entity';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the student',
  })
  @IsString()
  firstName: string;
  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the student',
  })
  @IsString()
  lastName: string;
  @ApiProperty({
    example: '1990-01-01',
    description: 'The birth date of the student',
  })
  @IsString()
  birthDate: string;
  @ApiProperty({
    example: 'male',
    description: 'Gender of the student',
  })
  @IsEnum(Gender, {
    message: `Invalide gender . Accepted values are: ${Object.values(Gender).join(', ')}`,
  })
  gender: Gender;

  @ApiProperty({
    example: 1,
    description: 'The id of the school the student is attending',
  })
  @IsNumber()
  schoolId: number;

  @ApiProperty({
    example: [1, 2],
    description: 'The ids of the licenses the student is applying for',
  })
  @IsNumber({}, { each: true })
  licenseTypeIds: number[];
}
