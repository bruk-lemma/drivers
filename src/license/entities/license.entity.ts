import { Expose } from 'class-transformer';
import { Student } from 'src/student/entities/student.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LicenseType {
  AUTOMOBILE = 'auto',
  MOTORCYCLE = 'moto',
  TRUCK = 'truck',
  BUS = 'bus',
}

@Entity()
export class License {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({
    type: 'enum',
    enum: LicenseType,
    nullable: false,
  })
  @Expose()
  licenseType: LicenseType;

  @ManyToMany(() => Student, (student) => student.licenseTypes)
  @JoinTable()
  students: Student[];

  @Column({
    default: true,
  })
  @Expose()
  isActive: boolean;

  //   @ManyToOne(() => Student, (student) => student.licenseTypes)
  //   student: Student;
}
