import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LicenseType } from '../entities/license.entity';

export class CreateLicenseDto {
  @ApiProperty({
    description: 'The type of the license',
    example: LicenseType.AUTOMOBILE,
    required: true,
    type: 'string',
  })
  @IsEnum(LicenseType, {
    message: `Invalide license type . Accepted values are: ${Object.values(LicenseType).join(', ')}`,
  })
  type: LicenseType;
}
