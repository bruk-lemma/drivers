import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Student } from 'src/student/entities/student.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Examination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    default: 'No description',
  })
  description: string;

  @Column({
    type: 'int',
  })
  @Expose()
  score: number;

  @Column({
    type: 'enum',
    enum: ['PASS', 'FAIL'],
  })
  @IsEnum(['PASS', 'FAIL'])
  status: string;

  @Column({
    type: 'enum',
    enum: ['PRACTICE', 'FINAL'],
    default: 'PRACTICE',
  })
  examType: string;

  @ManyToOne(() => Student, (student) => student.examinations, {
    // eager: true,
  })
  student: Student;
}
