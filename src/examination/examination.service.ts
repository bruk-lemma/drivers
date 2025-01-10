import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExaminationDto } from './dto/create-examination.dto';
import { UpdateExaminationDto } from './dto/update-examination.dto';
import { Question } from './entities/questions.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuestionsDto } from './dto/create-questions.dto';
import { QuestionsResponseDto } from './dto/questions-response.dto';
import { CalculateDto } from './dto/calculate-dto';
import { Expose, plainToInstance } from 'class-transformer';
import { CreateStudentRecordDto } from './dto/create-student-record.dto';
import { Examination } from './entities/examination.entity';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class ExaminationService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(Examination)
    private examinationRepository: Repository<Examination>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  async create(createExaminationDtos: CreateExaminationDto[]) {
    try {
      const savedQuestions = [];

      for (const createExaminationDto of createExaminationDtos) {
        // Check if the question already exists in the database
        const existingQuestion = await this.questionsRepository.findOne({
          where: {
            description: createExaminationDto.description,
            choice1: createExaminationDto.choice1,
            choice2: createExaminationDto.choice2,
            choice3: createExaminationDto.choice3,
            choice4: createExaminationDto.choice4,
          },
        });

        if (existingQuestion) {
          throw new BadRequestException(
            `Question with description "${createExaminationDto.description}" already exists.`,
          );
        }

        // Create a new Question entity
        const question = new Question();
        question.description = createExaminationDto.description;
        question.choice1 = createExaminationDto.choice1;
        question.choice2 = createExaminationDto.choice2;
        question.choice3 = createExaminationDto.choice3;
        question.choice4 = createExaminationDto.choice4;
        question.answer = createExaminationDto.answer;

        // Save the question to the database
        const savedQuestion = await this.questionsRepository.save(question);
        savedQuestions.push(savedQuestion);
      }

      return savedQuestions;
    } catch (e) {
      throw e;
    }
  }

  findAll() {
    return `This action returns all examination`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examination`;
  }

  update(id: number, updateExaminationDto: UpdateExaminationDto) {
    return `This action updates a #${id} examination`;
  }

  remove(id: number) {
    return `This action removes a #${id} examination`;
  }

  async createQuestion(CreateQuestionsDto: CreateQuestionsDto[]) {
    try {
      const savedQuestions = [];
      for (const createQuestionDto of CreateQuestionsDto) {
        // Check if the question already exists in the database
        const existingQuestion = await this.questionsRepository.findOne({
          where: {
            description: createQuestionDto.description,
            choice1: createQuestionDto.choice1,
            choice2: createQuestionDto.choice2,
            choice3: createQuestionDto.choice3,
            choice4: createQuestionDto.choice4,
            answer: createQuestionDto.answer,
          },
        });

        if (existingQuestion) {
          throw new BadRequestException(
            `Question with description "${createQuestionDto.description}" already exists.`,
          );
        }

        // Create a new Question entity
        const question = new Question();
        question.description = createQuestionDto.description;
        question.choice1 = createQuestionDto.choice1;
        question.choice2 = createQuestionDto.choice2;
        question.choice3 = createQuestionDto.choice3;
        question.choice4 = createQuestionDto.choice4;
        question.answer = createQuestionDto.answer;

        // Save the question to the database
        const savedQuestion = await this.questionsRepository.save(question);
        savedQuestions.push(savedQuestion);
      }

      return {
        message: 'Questions created successfully',
        data: savedQuestions,
      };
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }

  //fetch random questions
  async fetchRandomQuestions(): Promise<QuestionsResponseDto[]> {
    try {
      const questions = await this.questionsRepository
        .createQueryBuilder()
        .orderBy('RANDOM()') // Use RAND() for MySQL
        .limit(10)
        .getMany();

      console.log('Fetched questions:', questions);

      if (questions.length === 0) {
        throw new BadRequestException(
          'No questions found in the database. Please add some questions first.',
        );
      }
      //      return schools.map((school) => this.mapEntityToDto(school));
      //save the questions somewhere to be used for scoring

      return questions.map((question) => this.mapEntityToDto(question));
    } catch (error) {
      console.error('Error fetching random questions:', error);
      throw new Error(
        'Unable to fetch random questions at this time. Please try again later.',
      );
    }
  }

  async calculateScore(calculateDto: CalculateDto[]) {
    try {
      console.log('the calculateDto', calculateDto);
      let score = 0;
      for (const dto of calculateDto) {
        console.log(dto.id);
        const question = await this.questionsRepository.findOne({
          where: { id: dto.id },
        });
        if (!question) {
          throw new BadRequestException(
            `Question with ID "${dto.id}" not found.`,
          );
        }
        console.log('first question', question);
        if (question.answer === dto.answer) {
          score++;
        }
      }
      return new CalculateScoreResponseDto(
        'Score calculated successfully',
        score,
        'test',
        // score >= 5 ? 'PASSED' : 'FAILED',
      );
    } catch (e) {
      console.error('Error calculating score:', e);
      throw e;
    }
  }

  async createStudentExamination(createStudentRecord: CreateStudentRecordDto) {
    //create a student examination
    try {
      const student = await this.studentRepository.findOne({
        where: { id: createStudentRecord.studentId },
      });
      if (!student) {
        throw new BadRequestException(`Student  not found.`);
      }
      const studentExamination = new Examination();
      studentExamination.description = createStudentRecord.description;
      studentExamination.score = createStudentRecord.score;
      if (createStudentRecord.score >= 50) {
        studentExamination.status = 'PASS';
      }
      if (createStudentRecord.score < 50) {
        studentExamination.status = 'FAIL';
      }
      studentExamination.examType = createStudentRecord.examType;
      studentExamination.student = student;

      await this.examinationRepository.save(studentExamination);

      return new StudentRecordResponseDto(
        'Student examination created successfully',
        student,
        studentExamination,
      );
    } catch (e) {
      // console.error('Error creating student examination:', e);
      throw e;
    }
  }
  private mapEntityToDto(question: Question): QuestionsResponseDto {
    const questionResponseDto = new QuestionsResponseDto();
    questionResponseDto.id = question.id;
    questionResponseDto.description = question.description;
    questionResponseDto.choice1 = question.choice1;
    questionResponseDto.choice2 = question.choice2;
    questionResponseDto.choice3 = question.choice3;
    questionResponseDto.choice4 = question.choice4;
    questionResponseDto.answer = question.answer;
    return questionResponseDto;
  }
}
export class CalculateScoreResponseDto {
  @Expose()
  message: string;

  @Expose()
  score: number;

  @Expose()
  status: string;

  constructor(message: string, score: number, status: string) {
    this.message = message;
    this.score = score;
    this.status = status;
  }
}

export class StudentRecordResponseDto {
  @Expose()
  message: string;

  @Expose()
  student: Student;

  @Expose()
  examination: Examination;

  constructor(message: string, student: Student, examination: Examination) {
    this.message = message;
    this.student = student;
    this.examination = examination;
  }
}
