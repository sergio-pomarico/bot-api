import { CategoryDTO } from '@domain/dtos';
import { CategoryEntity } from '@domain/entities';
import { CategoryRepository } from '@domain/repositories';
import { CategoryModel } from '@infrastructure/data/models/category.model';
import { postgreSQLDatabase } from '@infrastructure/data/postgreSQL';

export class CategoryRepositoryImpl implements CategoryRepository {
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
  all = async (): Promise<CategoryEntity[] | null> => {
    try {
      const databaseRepository =
        postgreSQLDatabase.datasource.getRepository(CategoryModel);
      const categories = await databaseRepository.find();
      return categories;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      return null;
    }
  };
}
