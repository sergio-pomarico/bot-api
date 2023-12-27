import ClientDataSource from '@domain/datasources/client';
import { ClientDTO } from '@domain/dtos';
import { ClientEntity } from '@domain/entities';
import { CustomHTTPError } from '@domain/errors/custom';
import { ClientModel } from '@infrastructure/data/models/client.model';
import { postgreSQLDatabase } from '@infrastructure/data/postgreSQL';

export class ClientDataSourceImpl implements ClientDataSource {
  find = async (phone: string): Promise<ClientEntity | null> => {
    try {
      const databaseRepository =
        postgreSQLDatabase.datasource.getRepository(ClientModel);
      const clientFound = await databaseRepository.findOneBy({
        phone: parseInt(phone),
      });
      return clientFound;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
  create = async (clientDTO: ClientDTO): Promise<ClientEntity | null> => {
    try {
      const databaseRepository =
        postgreSQLDatabase.datasource.getRepository(ClientModel);
      const clientFound = await databaseRepository.findOneBy({
        phone: parseInt(clientDTO.phone),
      });
      if (clientFound != null)
        throw CustomHTTPError.badRequest('Cannot create a client');
      const newClient = new ClientModel();
      newClient.fullname = clientDTO.fullname;
      newClient.address = clientDTO.address;
      newClient.phone = parseInt(clientDTO.phone);
      newClient.documentId = parseInt(clientDTO.documentId);
      const client = await databaseRepository.save(newClient);
      return client;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
}
