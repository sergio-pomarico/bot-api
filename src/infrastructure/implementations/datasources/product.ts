import { ProductDataSource } from '@domain/datasources';
import { ProductDTO } from '@domain/dtos';
import { ProductEntity } from '@domain/entities';
import { ProductModel } from '@infrastructure/data/models/product.model';
import { postgreSQLDatabase } from '@infrastructure/data/postgreSQL';

export class ProductDataSourceImpl implements ProductDataSource {
  findByCategoryId = async (id: string): Promise<ProductEntity[] | null> => {
    try {
      const databaseRepository =
        postgreSQLDatabase.datasource.getRepository(ProductModel);
      const products = await databaseRepository.find({
        where: { category: id },
      });
      return products;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
  create = async (productDTO: ProductDTO): Promise<ProductEntity | null> => {
    try {
      const databaseRepository =
        postgreSQLDatabase.datasource.getRepository(ProductModel);
      const newProduct = new ProductModel();
      newProduct.name = productDTO.name;
      newProduct.price = productDTO.price;
      newProduct.description = productDTO.description;
      newProduct.category = productDTO.category!;

      const product = await databaseRepository.save(newProduct);
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
}
