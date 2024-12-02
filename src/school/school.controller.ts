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
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
// import { FileUploadDto } from './dto/file-upload.dto';
import { diskStorage } from 'multer';
import { SchoolResponseDto } from './dto/school-response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from './dto/api-response.dto';

@Auth(AuthType.None)
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

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
    FileInterceptor('upload/school', {
      storage: diskStorage({
        destination: './uploads/licence', // Directory to save the file
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
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
    if (!file) {
      throw new BadRequestException(
        'File is required and must meet size and type restrictions.',
      );
    }

    // Save file metadata to database
    const savedFile = await this.schoolService.saveFileData({
      schoolId: schoolId,
      fileName: file.filename,
      filePath: `./uploads/${file.filename}`,
      fileType: file.mimetype.split('/')[1],
      fileSize: (file.size / 1024).toFixed(2) + ' KB', // Convert size to KB
    });

    return {
      message: 'File uploaded and saved successfully',
      file: savedFile,
    };
  }
}
