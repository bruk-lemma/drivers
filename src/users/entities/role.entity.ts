import { Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose()
  name: string;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];
}
