import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.entity';

export enum TokenType {
  EMAIL_VERIFICATION = 'email-verification',
  PHONE_VERIFICATION = 'phone-verifcation',
  RESET = 'reset',
}

@Entity()
export class Reset_And_Verification_Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => Users, (user) => user.resetTokens)
  user: Users;

  // @Column()
  // userId: string;

  @Column({
    type: 'enum',
    enum: TokenType,
    nullable: false,
    //default: TokenType.RESET, // Set the default value
  })
  type: TokenType;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ default: false })
  isAcitve: boolean;
}
