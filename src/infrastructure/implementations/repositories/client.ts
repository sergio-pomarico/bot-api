import { ClientDataSource } from '@domain/datasources';
import { ClientDTO } from '@domain/dtos';
import { ClientEntity } from '@domain/entities';
import { ClientRepository } from '@domain/repositories';

export class ClientDataRepositoryImpl implements ClientRepository {
  constructor(private readonly dataSource: ClientDataSource) {}
  create = async (clientDTO: ClientDTO): Promise<ClientEntity | null> => {
    return this.dataSource.create(clientDTO);
  };
  find = async (documentId: string): Promise<ClientEntity | null> => {
    return this.dataSource.find(documentId);
  };
}
