import ProductDTO from '@domain/dtos/product';
import { ProductEntity } from '@domain/entities';

export interface ProductRepository {
  create: (productDTO: ProductDTO) => Promise<ProductEntity | null>;
  findById: (id: string) => Promise<ProductEntity | null>;
  findByCategoryId: (id: string) => Promise<Array<ProductEntity> | null>;
}
