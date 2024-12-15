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
  // AUTOMOBILE = 'auto',

  Two_legged_vehicle = 'ባለ-ሁለት-እግር-ተሽከርካሪ',
  Three_legged_vehicle = 'ባለ-ሦስት-እግር-ተሽከርካሪ',
  AUTOMOBILE = 'አውቶሞቢል',
  People_1 = 'ህዝብ-1',
  People_2 = 'ህዝብ-2',
  People_3 = 'ህዝብ-3',
  Dry_Cargo_1 = 'ደረቅ-1',
  Dry_Cargo_2 = 'ደረቅ-2',
  Dry_Cargo_3 = 'ደረቅ-3',
  Liqiuide_Cargo_1 = 'ፈሳሽ-1',
  Liqiuide_Cargo_2 = 'ፈሳሽ-2',
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
