import { CreateCategory } from '@application/usecases/category/create';
import { CategoryDataSource } from '@domain/datasources';
import { CategoryRepository } from '@domain/repositories';
import { CategoryController } from '@infrastructure/controllers/category';
import { CategoryDataSourceImpl } from '@infrastructure/implementations/datasources/category';
import { CategoryRepositoryImpl } from '@infrastructure/implementations/repositories/category';
import { Router } from 'express';

export class CategoryRoutes {
  constructor(
    public readonly router = Router(),
    private readonly datasource: CategoryDataSource = new CategoryDataSourceImpl(),
  ) {
    this.repository = new CategoryRepositoryImpl(this.datasource);
    this.createCategoryUsecases = new CreateCategory(this.repository);
    this.controller = new CategoryController(this.createCategoryUsecases);
    this.routes();
  }
  private readonly repository: CategoryRepository;
  private readonly createCategoryUsecases: CreateCategory;
  private readonly controller: CategoryController;
  routes(): void {
    this.router.post('/create', this.controller.create);
  }
}
