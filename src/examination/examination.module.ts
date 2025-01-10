import { Module } from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { ExaminationController } from './examination.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/questions.entity';
import { StudentModule } from 'src/student/student.module';
import { Examination } from './entities/examination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Examination]), StudentModule],
  controllers: [ExaminationController],
  providers: [ExaminationService],
})
export class ExaminationModule {}
