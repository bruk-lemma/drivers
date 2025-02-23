import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SchoolFiles } from './school-files.entity';
import { Student } from 'src/student/entities/student.entity';
import { Users } from 'src/users/entities/user.entity';

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  uniqueSchoolId: string;

  @Column()
  name: string;

  @Column()
  tin: string;

  @Column()
  businessLicenseNumber: string;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  kebele: string;

  @Column({ nullable: true })
  wereda: string;

  @Column()
  houseNumber: string;

  @Column()
  phoneNumber: string;

  @Column()
  managerName: string;

  @Column()
  managerPhoneNumber: string;

  @Column()
  email: string;

  @OneToMany(() => Student, (student) => student.school)
  students: Student[];

  @OneToOne(() => Users, (user) => user.school)
  @JoinColumn()
  createdBy: Users;

  // @Exclude()
  @Column()
  createdAt: Date;

  //@Exclude()
  @Column({ nullable: true })
  updatedAt: Date;

  // @Exclude()
  @Column({ nullable: true })
  deletedAt: Date;

  //@Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => SchoolFiles, (schoolFiles) => schoolFiles.school)
  files: SchoolFiles[];
}
