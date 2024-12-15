import { Expose } from 'class-transformer';
import { SchoolFiles } from '../entities/school-files.entity';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Users } from 'src/users/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';

export class SchoolResponseDto {
  //   @ApiProperty({
  //     description: 'The status of the request',
  //     type: String,
  //   })
  //   @Expose()
  //   message: string;
  @ApiProperty({
    description: 'The id of the school',
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The unique school id',
    type: String,
  })
  @Expose()
  uniqueSchoolId: string;

  @ApiProperty({
    description: 'The name of the school',
    type: String,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The tin of the school',
    type: String,
  })
  @Expose()
  tin: string;

  @ApiProperty({
    description: 'the business license number of the school',
    type: String,
  })
  @Expose()
  businessLicenseNumber: string;

  @ApiProperty({
    description: 'the region of the school',
    type: String,
  })
  @Expose()
  region: string;

  @ApiProperty({
    description: 'the city of the school',
    type: String,
  })
  @Expose()
  city: string;

  @ApiProperty({
    description: 'the kebele of the school',
    type: String,
  })
  @Expose()
  kebele: string;

  @ApiProperty({
    description: 'the region of the school',
    type: String,
  })
  @Expose()
  wereda: string;

  @ApiProperty({
    description: 'the phone number of the scholl',
    type: String,
  })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    description: 'the name of the manager of the scholl',
    type: String,
  })
  @Expose()
  managerName: string;

  @ApiProperty({
    description: 'the phone number  of the manager of the scholl',
    type: String,
  })
  @Expose()
  managerPhoneNumber: string;

  @ApiProperty({
    description: 'The email of the school',
    type: String,
  })
  @Expose()
  email: string;
  // students: Student[];
  //   createdAt: Date;
  //   updatedAt: Date;
  //   deletedAt: Date;
  //   isDeleted: boolean;
  @Expose()
  files: SchoolFiles[];

  @ApiProperty({
    description: 'The students of the school',
    type: Student,
  })
  @Expose()
  students: Student[];

  @ApiProperty({
    description: 'The user that created the school',
    type: Users,
  })
  @Expose()
  createdBy: Users;
}
