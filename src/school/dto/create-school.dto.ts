import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Users } from 'src/users/entities/user.entity';

export class CreateSchoolDto {
  @ApiProperty({
    example: 'Genesis School',
    description: 'The name of the school',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '123, School Road, Schoolville',
    description: 'The address of the school',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '08012345678',
    description: 'The phone number of the school',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'school1@gmail.com',
    description: 'The email address of the school',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 1,
    description: 'The id of the user that created the school',
  })
  @IsNotEmpty()
  createdBy: number;

  @ApiProperty({
    example: 'schoolLicense',
    description: 'The license of the school',
  })
  @IsString()
  @IsNotEmpty()
  schoolLicense: string;
}
