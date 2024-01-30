import { ProductAttributeEntity } from '@domain/entities';
import { ProductAttributeRepository } from '@domain/repositories';
import { ProductAttributeModel } from '@infrastructure/data/models';
import { postgreSQLDatabase } from '@infrastructure/data/postgreSQL';

export class ProductAttributeRepositoryImpl
  implements ProductAttributeRepository
{
  findAttributesByProductId = async (
    productId: string,
  ): Promise<ProductAttributeEntity[] | null> => {
    try {
      const databaseRepository = postgreSQLDatabase.datasource.getRepository(
        ProductAttributeModel,
      );
      const productAttributes = await databaseRepository.find({
        where: { productId: productId },
      });
      return productAttributes;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
}
