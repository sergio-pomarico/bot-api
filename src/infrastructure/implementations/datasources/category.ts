import { CategoryDataSource } from '@domain/datasources';
import { CategoryDTO } from '@domain/dtos';
import { CategoryEntity } from '@domain/entities';
import { CategoryModel } from '@infrastructure/data/models/category.model';
import { postgreSQLDatabase } from '@infrastructure/data/postgreSQL';

export class CategoryDataSourceImpl implements CategoryDataSource {
  create = async (categoryDTO: CategoryDTO): Promise<CategoryEntity | null> => {
    try {
      const databaseRepository =
        postgreSQLDatabase.datasource.getRepository(CategoryModel);
      const newCategory = new CategoryModel();
      newCategory.title = categoryDTO.title;
      const category = await databaseRepository.save(newCategory);
      return category;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
  all: () => Promise<CategoryEntity[] | null>;
}
