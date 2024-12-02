import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './student.entity';

export enum StudentDocumentType {
  GRADE_EIGHT = 'grade-eight',
  GRADE_TEN = 'grade-ten',
  GRADE_TWELVE = 'grade-twelve',
  KEBELE_ID = 'kebele-id',
  EYE_EXAMINATION_RESULT = 'eye-examination-result',
  BLOOD_TYPE = 'blood-type',
}

@Entity()
export class StudentFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.files)
  student: Student;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  fileType: string;

  @Column()
  fileSize: string;

  @Column({
    type: 'enum',
    enum: StudentDocumentType,
    nullable: false,
  })
  fileCategory: StudentDocumentType;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
