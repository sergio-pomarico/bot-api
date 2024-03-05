import { ProductAttributeEntity } from '@domain/entities';
import { ProductAttributeRepository } from '@domain/repositories';
import { ProductAttributeModel } from '@infrastructure/data/models';
import { postgreSQLDatabase } from '@infrastructure/data/postgreSQL';

export class ProductAttributeRepositoryImpl
  implements ProductAttributeRepository
{
  findAttributesByProductId = async (
    id: string,
  ): Promise<ProductAttributeEntity[] | null> => {
    try {
      const databaseRepository = postgreSQLDatabase.datasource.getRepository(
        ProductAttributeModel,
      );
      const productAttributes = await databaseRepository.find({
        where: { product: { id } },
      });
      return productAttributes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
  findById = async (id: string): Promise<ProductAttributeEntity | null> => {
    try {
      const databaseRepository = postgreSQLDatabase.datasource.getRepository(
        ProductAttributeModel,
      );
      const productAttribute = await databaseRepository.findOne({
        where: { id },
        relations: ['product'],
      });
      return productAttribute;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
}
