import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  choice1: string;

  @Column()
  choice2: string;

  @Column()
  choice3: string;

  @Column()
  choice4: string;

  @Column()
  answer: string;

  //   @ManyToOne(() => Examination, (examination) => examination.questions)
  //   examination: Examination;
}
