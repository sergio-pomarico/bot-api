import { ClientDTO } from '@domain/dtos';
import { ClientEntity } from '../entities';

export interface ClientRepository {
  create: (clientDTO: ClientDTO) => Promise<ClientEntity | null>;
}
