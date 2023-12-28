import { ProductCategoryDTO } from '@domain/dtos';
import { ProductCategoryEntity } from '../entities';

export interface ProductCategoryRepository {
  create: (
    categoryDTO: ProductCategoryDTO,
  ) => Promise<ProductCategoryEntity | null>;
  all: () => Promise<Array<ProductCategoryEntity> | null>;
}
