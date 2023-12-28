import { ProductCategoryDTO } from '@domain/dtos';
import { ProductCategoryEntity } from '../entities';

export interface ProductCategoryDataSource {
  create: (
    categoryDTO: ProductCategoryDTO,
  ) => Promise<ProductCategoryEntity | null>;
  all: () => Promise<Array<ProductCategoryEntity> | null>;
}
