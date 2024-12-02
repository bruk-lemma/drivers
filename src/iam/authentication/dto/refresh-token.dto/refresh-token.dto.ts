import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJlZnJlc2hUb2tlbklkIjoiZmVlNzhmNjQtODVmMi00MWY0LWE5Y2EtYWU3MGI3YzRhZTIzIiwiaWF0IjoxNzMzMDU0NTMyLCJleHAiOjE3MzMxNDA5MzIsImF1ZCI6ImxvY2FsaG9z',
  })
  @IsNotEmpty()
  refreshToken: string;
}
