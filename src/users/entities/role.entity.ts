import { Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.entity';

export enum RoleEnum {
  Default = 'default',
  schoolAdmin = 'schoolAdmin',
  superAdmin = 'superAdmin',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose()
  name: RoleEnum;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];
}
