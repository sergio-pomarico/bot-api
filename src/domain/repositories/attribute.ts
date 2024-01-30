import { ProductAttributeEntity } from '../entities';

export interface ProductAttributeRepository {
  findAttributesByProductId: (
    productId: string,
  ) => Promise<Array<ProductAttributeEntity> | null>;
}
