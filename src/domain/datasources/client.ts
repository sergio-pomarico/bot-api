import { ClientDTO } from '../dtos';
import { ClientEntity } from '../entities';

export default interface ClientDataSource {
  create: (clientDTO: ClientDTO) => Promise<ClientEntity | null>;
  find: (documentId: string) => Promise<ClientEntity | null>;
}
