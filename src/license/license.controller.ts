import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LicenseService } from './license.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ApiResponseDto } from 'src/school/dto/api-response.dto';
import { LicenseResponseDto } from './dto/license-response.dto';
import { ApiResponse } from '@nestjs/swagger';

@Auth(AuthType.None)
@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Post()
  create(@Body() createLicenseDto: CreateLicenseDto) {
    return this.licenseService.create(createLicenseDto);
  }

  @ApiResponse({
    type: LicenseResponseDto,
    isArray: true,
    description: 'Returns List of licenses',
  })
  @Get()
  async findAll(): Promise<ApiResponseDto<LicenseResponseDto[]>> {
    const license = await this.licenseService.findAll();
    return new ApiResponseDto(license, 'Licenses retrieved successfully');
  }

  @ApiResponse({
    type: LicenseResponseDto,
    description: 'Returns a license by id',
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<LicenseResponseDto>> {
    const licence = await this.licenseService.findOne(+id);
    return new ApiResponseDto(licence, 'License retrieved successfully');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLicenseDto: UpdateLicenseDto) {
    return this.licenseService.update(+id, updateLicenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licenseService.remove(+id);
  }
}
