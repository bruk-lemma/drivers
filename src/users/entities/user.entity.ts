import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Role } from '../enums/role.enum';
import { PermissionType } from './permissions.type';
import { Application } from 'src/application/entities/application.entity';
import { School } from 'src/school/entities/school.entity';
import { Expose } from 'class-transformer';
import { Role } from './role.entity';
// import {
//   Permission,
//   PermissionType,
// } from 'src/iam/authorization/permission.type';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  password: string;

  // @Column({ enum: Role, default: Role.Regular })
  // role: Role;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Column({ type: 'json', default: [] })
  permissions: PermissionType[];

  @ManyToMany(() => Application, (application) => application.user)
  @JoinTable()
  applications: Application[];

  @OneToOne(() => School, (school) => school.createdBy, { cascade: true })
  // This marks this side of the relation as the owning side.
  school: School;

  // @Column({ enum: Permission, default: [], type: 'json' })
  // permissions: PermissionType[];
  // @Column({ type: 'json', default: [] })
  // permissions: PermissionType[];
}
