import { CategoryDTO } from '@domain/dtos';
import { CategoryEntity } from '../entities';

export interface CategoryDataSource {
  create: (categoryDTO: CategoryDTO) => Promise<CategoryEntity | null>;
  all: () => Promise<Array<CategoryEntity> | null>;
}
