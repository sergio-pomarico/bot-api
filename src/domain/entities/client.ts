import OrderEntity from './order';

export default interface ClientEntity {
  id?: string;
  fullname?: string;
  address?: string;
  documentId?: number;
  orders?: OrderEntity[];
  phone?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
