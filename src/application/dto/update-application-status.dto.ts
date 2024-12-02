import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../entities/application.entity';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'Application ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  applicationId: number;
  @ApiProperty({
    description: 'Application Number',
    example: 'icvn56dfst',
  })
  @IsNotEmpty()
  @IsString()
  applicationNumber: string;

  @ApiProperty({
    description: 'Application Status',
    example: 'approved',
  })
  @IsNotEmpty()
  @IsEnum(ApplicationStatus, {
    message: `Application Status must be one of the following values: ${Object.values(ApplicationStatus).join(', ')}`,
  })
  applicationStatus: ApplicationStatus;
  // approvedBy: string;
  // approvedDate: Date;

  @ApiProperty({
    description: 'Remarks',
    example: 'The application lacks the required documents',
  })
  @IsString()
  remarks: string;

  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  approvedBy: number;
}
