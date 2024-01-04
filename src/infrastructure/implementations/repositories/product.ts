import { ProductDataSource } from '@domain/datasources';
import { ProductDTO } from '@domain/dtos';
import { ProductEntity } from '@domain/entities';
import { ProductRepository } from '@domain/repositories';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly dataSource: ProductDataSource) {}
  create = async (productDTO: ProductDTO): Promise<ProductEntity | null> => {
    return this.dataSource.create(productDTO);
  };
  findByCategoryId = async (id: string): Promise<ProductEntity[] | null> => {
    return this.dataSource.findByCategoryId(id);
  };
}
