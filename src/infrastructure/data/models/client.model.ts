import { ClientEntity } from '@domain/entities';
import { Column, Entity } from 'typeorm';
import BaseModel from './base.model';

@Entity({ name: 'client' })
export default class ClientModel extends BaseModel implements ClientEntity {
  @Column()
  fullname: string;

  @Column()
  address: string;

  @Column({ type: 'bigint', unique: true })
  documentId: number;

  @Column({ type: 'bigint', unique: true })
  phone: number;
}
