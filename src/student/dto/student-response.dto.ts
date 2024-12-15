import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/student.entity';
import { Expose } from 'class-transformer';
import { License, LicenseType } from 'src/license/entities/license.entity';

export class StudentResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the student',
  })
  @Expose()
  id: number;
  @ApiProperty({
    example: 'John',
    description: 'The first name of the student',
  })
  @Expose()
  firstName: string;
  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the student',
  })
  @Expose()
  lastName: string;
  @ApiProperty({
    example: '1990-01-01',
    description: 'The birth date of the student',
  })
  @Expose()
  birthDate: string;
  @ApiProperty({
    example: 'male',
    description: 'The gender of the student',
  })
  @Expose()
  gender: Gender;

  @ApiProperty({
    example: [LicenseType.AUTOMOBILE],
    description: 'The license types of the student',
  })
  @Expose()
  licenseTypes: LicenseType[];
}
