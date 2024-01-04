import { ProductEntity } from '@domain/entities';

export interface ProductRepository {
  create: (product: ProductEntity) => Promise<ProductEntity | null>;
  findByCategoryId: (id: number) => Promise<Array<ProductEntity> | null>;
}
