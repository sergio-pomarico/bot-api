import { ClientDTO } from '@domain/dtos';
import { ClientEntity } from '@domain/entities';
import { CustomHTTPError } from '@domain/errors/custom';
import { ClientRepository } from '@domain/repositories';
import { ClientModel } from '@infrastructure/data/models';
import { datasource } from '@infrastructure/data/postgreSQL';

export class ClientRepositoryImpl implements ClientRepository {
  find = async (phone: string): Promise<ClientEntity | null> => {
    try {
      const databaseRepository = datasource.getRepository(ClientModel);
      const clientFound = await databaseRepository.findOne({
        where: { phone: parseInt(phone) },
        relations: {
          orders: {
            items: { product: true },
            restaurant: true,
          },
        },
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
      const databaseRepository = datasource.getRepository(ClientModel);
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
