import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentFiles } from './entities/studentFiles.entity';
import { LicenseModule } from 'src/license/license.module';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, StudentFiles]),
    LicenseModule,
    SchoolModule,
  ],
  controllers: [StudentController],
  providers: [StudentService], //
  exports: [TypeOrmModule],
})
export class StudentModule {}
