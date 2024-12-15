import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { School } from './school.entity';
import { Expose } from 'class-transformer';

export enum SchoolFilesType {
  MANAGER_ID = 'MANAGER_ID',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
  TIN = 'TIN',
}

@Entity()
export class SchoolFiles {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @ManyToOne(() => School, (school) => school.files)
  school: School;

  @Column()
  @Expose()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  @Expose()
  fileType: string;

  @Column()
  fileSize: string;

  @Column({ nullable: false })
  @Expose()
  documentType: SchoolFilesType;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
