import { UserEntity } from '@domain/entities';
import { Entity, Column } from 'typeorm';
import BaseModel from './base.model';

@Entity({ name: 'user' })
export default class UserModel extends BaseModel implements UserEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'bigint', unique: true })
  phone: number;

  @Column({ default: false })
  active: boolean;

  @Column({
    name: 'last_login',
    type: 'timestamp',
    nullable: true,
  })
  lastLogin: Date;
}
