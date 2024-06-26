import { ProductDTO } from '@domain/dtos';
import { ProductEntity } from '@domain/entities';
import { CustomHTTPError } from '@domain/errors/custom';
import { ProductRepository } from '@domain/repositories';
import { CategoryModel, ProductModel } from '@infrastructure/data/models';
import { datasource } from '@infrastructure/data/postgreSQL';

export class ProductRepositoryImpl implements ProductRepository {
  findByCategoryId = async (id: string): Promise<ProductEntity[] | null> => {
    try {
      const productRepository = datasource.getRepository(ProductModel);
      const products = await productRepository.find({
        where: { category: { id } },
        relations: ['attributes'],
      });
      return products;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
  findById = async (id: string): Promise<ProductEntity | null> => {
    try {
      const productRepository = datasource.getRepository(ProductModel);
      const products = await productRepository.findOne({
        where: { id },
        relations: ['attributes'],
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
      const productRepository = datasource.getRepository(ProductModel);
      const categoryRepository = datasource.getRepository(CategoryModel);

      const category = await categoryRepository.findOne({
        where: { id: productDTO.categoryId },
      });
      if (!category) {
        throw CustomHTTPError.badRequest('Cannot create product');
      }
      const newProduct = new ProductModel();
      newProduct.name = productDTO.name;
      newProduct.price = productDTO.price;
      newProduct.description = productDTO.description;
      newProduct.category = category;

      const product = await productRepository.save(newProduct);
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
}
