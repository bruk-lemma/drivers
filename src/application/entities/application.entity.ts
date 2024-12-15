import { Users } from 'src/users/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';
import { LicenseType } from 'src/license/entities/license.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import exp from 'constants';

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.applications, {
    nullable: false,
    eager: true,
  })
  @Expose()
  student: Student;

  @Column({ unique: true })
  @Expose()
  applicationNumber: string;

  @Column({ type: 'date' })
  applicationDate: Date;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  @Expose()
  applicationStatus: ApplicationStatus;

  @Column({ type: 'enum', enum: LicenseType })
  @Expose()
  application_License_Type: LicenseType;

  @ManyToMany(() => Users, (user) => user.applications, { cascade: true })
  user: Users[];

  // New Field: User who submitted the application
  @ManyToOne(() => Users, { nullable: false, eager: true })
  @Expose()
  submittedBy: Users;

  // New Field: User who approved the application
  @ManyToOne(() => Users, { nullable: true, eager: true })
  @Expose()
  approvedBy: Users;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: true })
  @Expose()
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  @Expose()
  remarks: string;
}
