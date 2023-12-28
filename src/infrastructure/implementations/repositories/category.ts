import { CategoryDataSource } from '@domain/datasources';
import { CategoryDTO } from '@domain/dtos';
import { CategoryEntity } from '@domain/entities';
import { CategoryRepository } from '@domain/repositories';

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private readonly dataSource: CategoryDataSource) {}
  create = async (categoryDTO: CategoryDTO): Promise<CategoryEntity | null> => {
    return this.dataSource.create(categoryDTO);
  };
  all: () => Promise<CategoryEntity[] | null>;
}
