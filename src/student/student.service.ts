import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFiles } from './entities/studentFiles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { In, Repository } from 'typeorm';
import { StudentFileType } from './dto/student-file-data.dto';
import { License } from 'src/license/entities/license.entity';
import { School } from 'src/school/entities/school.entity';
import { StudentResponseDto } from './dto/student-response.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(StudentFiles)
    private readonly studentFilesRepository: Repository<StudentFiles>,
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}
  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    try {
      const existingStudent = await this.studentRepository.findOne({
        where: {
          firstName: createStudentDto.firstName,
          lastName: createStudentDto.lastName,
          birthDate: createStudentDto.birthDate,
        },
      });
      if (existingStudent) {
        throw new ConflictException('Student already exists');
      }

      //fetch license types using the licenseTypeids
      const LicenseTypes = await this.licenseRepository.findBy({
        id: In(createStudentDto.licenseTypeIds),
      });

      if (LicenseTypes.length !== createStudentDto.licenseTypeIds.length) {
        throw new NotFoundException('One or more license types not found');
      }

      const school = await this.schoolRepository.findOne({
        where: { id: createStudentDto.schoolId },
      });
      if (!school) {
        throw new NotFoundException('School not found');
      }

      const newStudent = new Student();
      newStudent.firstName = createStudentDto.firstName;
      newStudent.lastName = createStudentDto.lastName;
      newStudent.birthDate = createStudentDto.birthDate;
      newStudent.gender = createStudentDto.gender;
      newStudent.school = school;
      //newStudent.schoolId = createStudentDto.schoolId;
      newStudent.licenseTypes = LicenseTypes;
      newStudent.createdAt = new Date();
      await this.studentRepository.save(newStudent);
      return this.mapEntityToDto(newStudent);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<StudentResponseDto[]> {
    try {
      const students = await this.studentRepository.find({
        // where: { isActive: true },
        relations: ['licenseTypes'],
      });
      if (!students) {
        throw new NotFoundException('No students found');
      }
      return students.map((student) => this.mapEntityToDto(student));
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<StudentResponseDto> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: id },
        relations: ['files'],
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      return this.mapEntityToDto(student);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: id },
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      await this.studentRepository.update(id, {
        ...updateStudentDto,
        updatedAt: new Date(),
      });

      await this.studentRepository.save(student);
      return student;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: id },
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      student.isActive = false;
      student.deletedAt = new Date();
      await this.studentRepository.save(student);
      return {
        message: 'Student deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async saveStudentFileData(fileData: StudentFileType) {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: fileData.studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const fileExists = await this.studentFilesRepository.findOne({
        where: {
          student: student,
          fileCategory: fileData.fileCategory,
        },
      });
      if (fileExists) {
        throw new ConflictException('File already exists');
      }

      const newStudentFile = this.studentFilesRepository.create({
        student: student,
        fileName: fileData.fileName,
        filePath: fileData.filePath,
        fileType: fileData.fileType,
        fileSize: fileData.fileSize,
        fileCategory: fileData.fileCategory,
        createdAt: new Date(),
      });
      return await this.studentFilesRepository.save(newStudentFile);
    } catch (error) {
      throw error;
    }
  }

  private mapEntityToDto(entity: Student): StudentResponseDto {
    const studentResponseDto = new StudentResponseDto();
    studentResponseDto.id = entity.id;
    studentResponseDto.firstName = entity.firstName;
    studentResponseDto.lastName = entity.lastName;
    studentResponseDto.birthDate = entity.birthDate;
    studentResponseDto.gender = entity.gender;
    studentResponseDto.licenseTypes = entity.licenseTypes.map(
      (license) => license.licenseType,
    );
    return studentResponseDto;
  }
}
