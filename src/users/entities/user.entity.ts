import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Role } from '../enums/role.enum';
import { PermissionType } from './permissions.type';
import { Application } from 'src/application/entities/application.entity';
import { School } from 'src/school/entities/school.entity';
import { Expose } from 'class-transformer';
import { Role } from './role.entity';
import { Reset_And_Verification_Token } from './tokens.entity';
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

  @OneToMany(
    (type) => Reset_And_Verification_Token,
    (resetToken) => resetToken.user,
  )
  resetTokens: Reset_And_Verification_Token[];
  // @Column({ enum: Permission, default: [], type: 'json' })
  // permissions: PermissionType[];
  // @Column({ type: 'json', default: [] })
  // permissions: PermissionType[];
}
