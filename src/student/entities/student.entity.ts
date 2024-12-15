import { Min } from 'class-validator';
import { License } from 'src/license/entities/license.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentFiles } from './studentFiles.entity';
import { Application } from 'src/application/entities/application.entity';
import { School } from 'src/school/entities/school.entity';
import { Expose } from 'class-transformer';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @Min(18)
  @Column()
  @Expose()
  birthDate: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @ManyToMany(() => License, (license) => license.students, {
    eager: true,
  })
  licenseTypes: License[];
  //   @OneToMany(() => License, (license) => license.student)
  //   licenseTypes: License[];

  @OneToMany(() => StudentFiles, (studentFiles) => studentFiles.student)
  files: StudentFiles[];

  @OneToMany(() => Application, (application) => application.student)
  applications: Application[];

  @ManyToOne(() => School, (school) => school.students, {
    eager: true,
  })
  school: School;

  @Column({
    nullable: true,
  })
  isActive: boolean;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({
    nullable: false,
  })
  createdAt: Date;
}
