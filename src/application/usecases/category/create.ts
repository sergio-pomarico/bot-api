import { CategoryDTO } from '@domain/dtos';
import { CategoryEntity } from '@domain/entities';
import { CategoryRepository } from '@domain/repositories';

export interface CreateCategoryUseCase {
  run: (registerDTO: CategoryDTO) => Promise<CategoryEntity>;
}
export class CreateCategory implements CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}
  run = async (categoryDTO: CategoryDTO): Promise<CategoryEntity> => {
    const category = await this.repository.create(categoryDTO!);
    return { ...category };
  };
}
