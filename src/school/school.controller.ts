import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
// import { FileUploadDto } from './dto/file-upload.dto';
import { diskStorage, memoryStorage } from 'multer';
import { SchoolResponseDto } from './dto/school-response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from './dto/api-response.dto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolFiles } from './entities/school-files.entity';
import { Repository } from 'typeorm';
@Auth(AuthType.None)
@Controller('school')
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    @InjectRepository(SchoolFiles)
    private readonly schoolFilesRepository: Repository<SchoolFiles>,
  ) {}

  @ApiResponse({
    type: SchoolResponseDto,
    description: 'Creates a new school',
  })
  @Post()
  async create(
    @Body() createSchoolDto: CreateSchoolDto,
  ): Promise<ApiResponseDto<SchoolResponseDto>> {
    const school = await this.schoolService.create(createSchoolDto);
    return new ApiResponseDto(school, 'School created successfully');
  }

  @ApiResponse({
    type: SchoolResponseDto,
    isArray: true,
    description: 'Returns List of schools',
  })
  @Get()
  async findAll(): Promise<ApiResponseDto<SchoolResponseDto[]>> {
    const schools = await this.schoolService.findAll();
    return new ApiResponseDto(schools, 'Schools retrieved successfully');
  }

  @ApiResponse({
    type: SchoolResponseDto,
    description: 'Returns a school by id',
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<SchoolResponseDto>> {
    const school = await this.schoolService.findOne(+id);
    return new ApiResponseDto(school, 'School retrieved successfully');
  }

  @ApiResponse({
    type: SchoolResponseDto,
    description: 'Returns a school by id',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.update(+id, updateSchoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolService.remove(+id);
  }

  @UseInterceptors(
    FileInterceptor('license', {
      storage: memoryStorage(), // Store files in memory instead of disk
      limits: {
        fileSize: 1 * 1024 * 1024, // 1 MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Unsupported file type. Only JPEG, PNG, or PDF are allowed.',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @Post('upload-school-license/:schoolId')
  async uploadFile(
    @Param('schoolId') schoolId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Validate if the school exists
    const school = await this.schoolService.findOne(schoolId);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    const existingLicense = await this.schoolFilesRepository.findOne({
      where: {
        documentType: 'School-License',
        school: { id: school.id }, // Ensure this matches the entity structure
      },
    });
    if (existingLicense) {
      throw new ConflictException(
        `License file already exists: ${existingLicense.fileName}`,
      );
    }

    if (!file) {
      throw new BadRequestException(
        'File is required and must meet size and type restrictions.',
      );
    }

    // Define the file path
    const uploadDir = './uploads/school_license';
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
      file.originalname
    }`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file to disk
    await fs.writeFile(filePath, file.buffer);

    // Save file metadata to database
    const savedFile = await this.schoolService.saveFileData({
      schoolId: schoolId,
      fileName: uniqueFileName,
      filePath,
      fileType: file.mimetype.split('/')[1],
      fileSize: (file.size / 1024).toFixed(2) + ' KB', // Convert size to KB
    });

    return new ApiResponseDto(
      savedFile,
      'File uploaded and saved successfully',
    );
  }

  // @Roles(Role.Admin)
  @Get('approve-school/:schoolId')
  async approveSchool(
    @Param('schoolId') schoolId: number,
  ): Promise<ApiResponseDto<SchoolResponseDto>> {
    const school = await this.schoolService.approveSchool(schoolId);
    return new ApiResponseDto(school, 'School approved successfully');
  }
}
