import { CategoryRepository } from '@domain/repositories';

export class GetAllCategoriesUseCase {
  constructor(private repository: CategoryRepository) {}
  async run() {
    const categories = await this.repository.all();
    return categories;
  }
}
