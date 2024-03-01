import { ProductAttributeEntity } from '../entities';

export interface ProductAttributeRepository {
  findAttributesByProductId: (
    productId: string,
  ) => Promise<Array<ProductAttributeEntity> | null>;
  findById: (id: string) => Promise<ProductAttributeEntity | null>;
}
