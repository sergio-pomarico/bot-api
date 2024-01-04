import ProductDTO from '@domain/dtos/product';
import { ProductEntity } from '@domain/entities';

export default interface ProductDataSource {
  create: (productDTO: ProductDTO) => Promise<ProductEntity | null>;
  findByCategoryId: (id: string) => Promise<Array<ProductEntity> | null>;
}
