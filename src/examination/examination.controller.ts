import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { CreateExaminationDto } from './dto/create-examination.dto';
import { UpdateExaminationDto } from './dto/update-examination.dto';
import { CreateQuestionsDto } from './dto/create-questions.dto';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { CalculateDto } from './dto/calculate-dto';
import { ApiBody } from '@nestjs/swagger';
import { CreateStudentRecordDto } from './dto/create-student-record.dto';

@Auth(AuthType.None)
@Controller('examination')
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}

  @Post()
  create(@Body() createExaminationDto: CreateExaminationDto[]) {
    return this.examinationService.create(createExaminationDto);
  }

  @Post('questions')
  async createQuestions(@Body() createQuestionsDto: CreateQuestionsDto[]) {
    return await this.examinationService.createQuestion(createQuestionsDto);
  }

  @Get('/get-random-questions')
  async getRandomQuestions(): Promise<any> {
    return await this.examinationService.fetchRandomQuestions();
  }

  @Post('/calculate')
  @ApiBody({ type: [CalculateDto] }) // Specify the type as an array
  async calculate(@Body() calculateDto: CalculateDto[]) {
    return await this.examinationService.calculateScore(calculateDto);
  }

  @Post('/create-student-record')
  async createStudentRecord(
    @Body() createStudentRecordDto: CreateStudentRecordDto,
  ) {
    return await this.examinationService.createStudentExamination(
      createStudentRecordDto,
    );
  }

  @Get()
  findAll() {
    return this.examinationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examinationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExaminationDto: UpdateExaminationDto,
  ) {
    return this.examinationService.update(+id, updateExaminationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examinationService.remove(+id);
  }
}
