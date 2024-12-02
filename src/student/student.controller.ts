import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { UploadStudentDataDto } from './dto/upload-student-data.dto';
import { ApiResponse } from '@nestjs/swagger';
import { StudentResponseDto } from './dto/student-response.dto';
import { ApiResponseDto } from 'src/school/dto/api-response.dto';

@Controller('student')
@Auth(AuthType.None)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiResponse({
    status: 201,
    description: 'creates a student',
    type: StudentResponseDto,
  })
  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<ApiResponseDto<StudentResponseDto>> {
    const student = await this.studentService.create(createStudentDto);
    return new ApiResponseDto(student, 'Student created successfully');
  }

  @ApiResponse({
    status: 200,
    description: 'Returns List of students',
    type: StudentResponseDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<ApiResponseDto<StudentResponseDto[]>> {
    const students = await this.studentService.findAll();
    return new ApiResponseDto(students, 'Students retrieved successfully');
  }

  @ApiResponse({
    status: 200,
    description: 'Returns a single student',
    type: StudentResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<StudentResponseDto>> {
    const student = await this.studentService.findOne(+id);
    return new ApiResponseDto(student, 'Student retrieved successfully');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }

  @UseInterceptors(
    FileInterceptor('upload/student', {
      storage: diskStorage({
        destination: './uploads/student', // Directory to save the file
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
  @Post('upload-student-document')
  async uploadFile(
    @Body() body: UploadStudentDataDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('stdeund id type is' + typeof body.studentId);
    if (!file) {
      throw new BadRequestException(
        'File is required and must meet size and type restrictions.',
      );
    }

    console.log('file category', body.documentType);
    // Save file metadata to database
    const savedFile = await this.studentService.saveStudentFileData({
      studentId: body.studentId,
      fileName: file.filename,
      filePath: `./uploads/student/${file.filename}`,
      fileType: file.mimetype.split('/')[1],
      fileSize: (file.size / 1024).toFixed(2) + ' KB', // Convert size to KB
      fileCategory: body.documentType,
      // fileCategory: StudentDocumentType[body.documentType],
      //fileCategory: StudentDocumentType, // or the appropriate enum value
    });

    return {
      message: 'File uploaded and saved successfully',
      file: savedFile,
    };
  }
}
