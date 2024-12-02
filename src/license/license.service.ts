import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { Repository } from 'typeorm';
import { License } from './entities/license.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LicenseResponseDto } from './dto/license-response.dto';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
  ) {}
  async create(createLicenseDto: CreateLicenseDto) {
    try {
      const existingLicense = await this.licenseRepository.findOne({
        where: {
          licenseType: createLicenseDto.type,
        },
      });
      if (existingLicense) {
        throw new ConflictException('License already exists');
      }
      const newLicense = new License();
      newLicense.licenseType = createLicenseDto.type;
      // newLicense.createdAt = new Date();
      return await this.licenseRepository.save(newLicense);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<LicenseResponseDto[]> {
    try {
      const licenses = await this.licenseRepository.find();
      if (!licenses) {
        throw new NotFoundException('No licenses found');
      }
      return licenses.map((license) => this.mapLicenseToResponseDto(license));
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<LicenseResponseDto> {
    try {
      const license = await this.licenseRepository.findOne({
        where: { id },
      });
      if (!license) {
        throw new NotFoundException('License not found');
      }
      return this.mapLicenseToResponseDto(license);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateLicenseDto: UpdateLicenseDto) {
    try {
      const license = await this.licenseRepository.findOne({
        where: { id },
      });
      if (!license) {
        throw new NotFoundException('License not found');
      }
      license.licenseType = updateLicenseDto.type;
      return await this.licenseRepository.save(license);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const license = await this.licenseRepository.findOne({
        where: { id },
      });
      if (!license) {
        throw new NotFoundException('License not found');
      }
      license.isActive = false;
      await this.licenseRepository.save(license);
      return {
        message: 'License deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  private mapLicenseToResponseDto(thelicense: License) {
    const licenceResponseDto = new LicenseResponseDto();
    licenceResponseDto.id = thelicense.id;
    licenceResponseDto.licenseType = thelicense.licenseType;
    licenceResponseDto.isActive = thelicense.isActive;
    return licenceResponseDto;
  }
}
