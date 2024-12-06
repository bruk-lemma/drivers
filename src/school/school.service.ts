import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { SchoolFiles } from './entities/school-files.entity';
import { SchoolResponseDto } from './dto/school-response.dto';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    @InjectRepository(SchoolFiles)
    private readonly schoolFilesRepository: Repository<SchoolFiles>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<SchoolResponseDto> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: createSchoolDto.createdBy },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const schoolExists = await this.schoolRepository.findOne({
        where: { email: createSchoolDto.email },
      });
      if (schoolExists) {
        throw new ConflictException('School already exists');
      }
      const uniqueSchoolId = randomUUID();
      const school = new School();
      school.name = createSchoolDto.name;
      school.uniqueSchoolId = uniqueSchoolId;
      school.address = createSchoolDto.address;
      school.phone = createSchoolDto.phone;
      school.email = createSchoolDto.email;
      school.createdBy = user;
      school.createdAt = new Date();
      await this.schoolRepository.save(school);
      return this.mapEntityToDto(school);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<SchoolResponseDto[]> {
    try {
      const schools: School[] = await this.schoolRepository.find({
        relations: ['files', 'createdBy'],
      });
      if (schools.length === 0 || !schools) {
        throw new NotFoundException('No schools found');
      }
      //add message to the response
      return schools.map((school) => this.mapEntityToDto(school));
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<SchoolResponseDto> {
    try {
      const school = await this.schoolRepository.findOne({
        where: { id },
        relations: ['files', 'createdBy'],
      });
      if (!school) {
        throw new NotFoundException('School not found');
      }
      return this.mapEntityToDto(school);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto) {
    try {
      const school = await this.schoolRepository.findOne({
        where: { id },
      });
      if (!school) {
        throw new NotFoundException('School not found');
      }
      school.name = updateSchoolDto.name;
      school.address = updateSchoolDto.address;
      school.phone = updateSchoolDto.phone;
      school.email = updateSchoolDto.email;
      school.updatedAt = new Date();
      await this.schoolRepository.save(school);
      return school;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const school = await this.schoolRepository.findOne({
        where: { id },
      });
      if (!school) {
        throw new NotFoundException('School not found');
      }
      school.isDeleted = true;
      school.deletedAt = new Date();
      await this.schoolRepository.save(school);
      return {
        message: 'School deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async saveFileData(fileData: {
    schoolId: number;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: string;
  }): Promise<SchoolFiles> {
    try {
      const school = await this.schoolRepository.findOne({
        where: { id: fileData.schoolId },
      });
      if (!school) {
        throw new NotFoundException('School not found');
      }

      const newFile = this.schoolFilesRepository.create({
        school: school,
        fileName: `licence-${school.name.replace(' ', '') + '-' + fileData.fileName}`,
        filePath: fileData.filePath,
        fileType: fileData.fileType,
        fileSize: fileData.fileSize,
        documentType: 'School-License',
        createdAt: new Date(),
      });
      return await this.schoolFilesRepository.save(newFile);
    } catch (error) {
      throw error;
    }
  }

  private mapEntityToDto(entity: School): SchoolResponseDto {
    const schoolResponseDto = new SchoolResponseDto();
    schoolResponseDto.id = entity.id;
    schoolResponseDto.uniqueSchoolId = entity.uniqueSchoolId;
    schoolResponseDto.name = entity.name;
    schoolResponseDto.address = entity.address;
    schoolResponseDto.phone = entity.phone;
    schoolResponseDto.email = entity.email;
    schoolResponseDto.files = entity.files;
    schoolResponseDto.createdBy = entity.createdBy;
    return schoolResponseDto;
  }

  async approveSchool(id: number): Promise<SchoolResponseDto> {
    try {
      const school = await this.schoolRepository.findOne({
        where: { id },
      });
      if (!school) {
        throw new NotFoundException('School not found');
      }
      school.isVerified = true;
      await this.schoolRepository.save(school);
      return this.mapEntityToDto(school);
    } catch (error) {
      throw error;
    }
  }
}
