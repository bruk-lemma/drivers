import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
// import { Users } from 'src/users/entities/user.entity';

export class CreateSchoolDto {
  @ApiProperty({
    example: 'Genesis School',
    description: 'The name of the school',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '123456789',
    description: 'The TIN of the school',
  })
  @IsString()
  @IsNotEmpty()
  tin: string;

  @ApiProperty({
    example: '123456789',
    description: 'The business license number of the school',
  })
  @IsString()
  @IsNotEmpty()
  businessLicenseNumber: string;

  @ApiProperty({
    example: 'Addis Ababa',
    description: 'The region of the school',
  })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({
    example: 'Addis Ababa',
    description: 'The city of the school',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: '14',
    description: 'The kebele of the school',
  })
  @IsString()
  @IsOptional()
  kebele: string;

  @ApiProperty({
    example: '12',
    description: 'The wereda of the school',
  })
  @IsString()
  @IsOptional()
  wereda: string;

  @ApiProperty({
    example: '123',
    description: 'The house number of the school',
  })
  @IsString()
  @IsNotEmpty()
  houseNumber: string;

  @ApiProperty({
    example: '+251942655600',
    description: 'The name of the manager of the school',
  })
  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the manager of the school',
  })
  @IsString()
  @IsNotEmpty()
  managerName: string;

  @ApiProperty({
    example: '+251942655600',
    description: 'The phone number of the manager of the school',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  managerPhoneNumber: string;

  // @ApiProperty({
  //   example: '123, School Road, Schoolville',
  //   description: 'The address of the school',
  // })
  // @IsString()
  // @IsNotEmpty()
  // address: string;

  // @ApiProperty({
  //   example: '08012345678',
  //   description: 'The phone number of the school',
  // })
  // @IsString()
  // @IsNotEmpty()
  // phoneNumber: string;

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

  // @ApiProperty({
  //   example: 'schoolLicense',
  //   description: 'The license of the school',
  // })
  // @IsString()
  // @IsNotEmpty()
  // schoolLicense: string;
}
