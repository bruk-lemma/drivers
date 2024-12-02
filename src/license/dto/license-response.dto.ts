import { ApiProperty } from '@nestjs/swagger';
import { LicenseType } from '../entities/license.entity';
import { Expose } from 'class-transformer';

export class LicenseResponseDto {
  @ApiProperty({
    type: Number,
    description: 'The id of the license',
  })
  @Expose()
  id: number;
  @ApiProperty({
    type: String,
    enum: LicenseType,
    description: 'The type of the license',
  })
  @Expose()
  licenseType: LicenseType;
  @ApiProperty({
    type: Boolean,
    description: 'The status of the license',
  })
  @Expose()
  isActive: boolean;
  //students: Student[];
}
