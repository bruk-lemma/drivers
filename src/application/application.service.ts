import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/updateapplication.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { randomUUID } from 'crypto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Student } from 'src/student/entities/student.entity';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  async create(userid: number, createApplicationDto: CreateApplicationDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: userid,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const student = await this.studentRepository.findOne({
        where: {
          id: createApplicationDto.studentId,
        },
      });

      // const submittedBy = await this.usersRepository.findOne({
      //   where: {
      //     id: createApplicationDto.submittedBy,
      //   },
      // });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const existingApplication = await this.applicationRepository.findOne({
        where: {
          student: student,
          application_License_Type:
            createApplicationDto.application_License_Type,
          applicationStatus: ApplicationStatus.PENDING,
        },
      });
      if (existingApplication) {
        throw new ConflictException('Application already exists');
      }

      // if (!submittedBy) {
      //   throw new NotFoundException('User not found');
      // }
      const application = this.applicationRepository.create({
        ...createApplicationDto,
        student,
        submittedBy: user,
      });
      application.applicationNumber = randomUUID();
      application.createdAt = new Date();
      await this.applicationRepository.save(application);
      return application;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const applications = await this.applicationRepository.find({
        relations: ['student', 'submittedBy', 'approvedBy'],
      });
      if (applications.length === 0) {
        throw new NotFoundException('No applications found');
      }
      return applications;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const application = await this.applicationRepository.findOne({
        where: {
          id,
        },
      });
      if (!application) {
        throw new NotFoundException('Application not found');
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    userid: number,
    updateApplicationDto: UpdateApplicationDto,
  ) {
    try {
      const application = await this.applicationRepository.findOne({
        where: {
          id,
        },
      });
      if (!application) {
        throw new NotFoundException('Application not found');
      }

      const submittedBy = await this.applicationRepository.findOne({
        where: {
          id: userid,
        },
      });
      if (!submittedBy) {
        throw new NotFoundException('User not found');
      }
      await this.applicationRepository.update(id, {
        ...updateApplicationDto,
        submittedBy,
        updatedAt: new Date(),
      });
      await this.applicationRepository.save(application);
      return application;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const application = await this.applicationRepository.findOne({
        where: {
          id,
        },
      });
      if (!application) {
        throw new NotFoundException('Application not found');
      }
      await this.applicationRepository.update(id, {
        isActive: false,
        deletedAt: new Date(),
      });
      await this.applicationRepository.save(application);
      return {
        message: 'Application deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateApplicationStatus(
    id: number,
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    try {
      const application = await this.applicationRepository.findOne({
        where: {
          id: updateApplicationStatusDto.applicationId,
          applicationNumber: updateApplicationStatusDto.applicationNumber,
        },
      });
      if (!application) {
        throw new NotFoundException('Application not found');
      }
      const approvedBy = await this.usersRepository.findOne({
        where: {
          id: updateApplicationStatusDto.approvedBy,
        },
      });
      console.log(approvedBy);
      if (!approvedBy) {
        throw new NotFoundException('User not found');
      }

      application.applicationStatus =
        updateApplicationStatusDto.applicationStatus;
      application.remarks = updateApplicationStatusDto.remarks;
      application.approvedBy = approvedBy;
      application.updatedAt = new Date();

      await this.applicationRepository.save(application);
      return {
        message: 'Application status updated successfully',
        status: application.applicationStatus,
        remark: application.remarks,
      };
    } catch (error) {
      throw error;
    }
  }
}
