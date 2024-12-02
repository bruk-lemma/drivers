import { Expose } from 'class-transformer';
import { SchoolFiles } from '../entities/school-files.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/users/entities/user.entity';

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
    description: 'The address of the school',
    type: String,
  })
  @Expose()
  address: string;

  @ApiProperty({
    description: 'The phone number of the school',
    type: String,
  })
  @Expose()
  phone: string;

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
    description: 'The user that created the school',
    type: Users,
  })
  @Expose()
  createdBy: Users;
}
