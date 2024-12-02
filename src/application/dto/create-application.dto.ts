import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { LicenseType } from 'src/license/entities/license.entity';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'Student ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  studentId: number;
  @ApiProperty({
    description: 'Application Date',
    example: '2021-09-01',
  })
  @IsNotEmpty()
  @IsDateString()
  applicationDate: Date;
  @ApiProperty({
    description: 'Application License Type',
    example: 'auto',
  })
  @IsNotEmpty()
  @IsEnum(LicenseType, {
    message: 'Invalid License Type',
  })
  application_License_Type: LicenseType;

  @ApiProperty({
    description: 'Submitted By',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  submittedBy: number;

  // @ApiProperty({
  //   description: 'Approved By',
  //   example: 1,
  // })
  // @IsNumber()
  // approvedBy: number;
}
