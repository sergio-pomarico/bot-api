import {
  CreateProductUseCase,
  CreateProduct,
} from '@application/usecases/product/create';
import { ProductDataSource } from '@domain/datasources';
import { ProductRepository } from '@domain/repositories';
import { ProductController } from '@infrastructure/controllers/product';
import { ProductDataSourceImpl } from '@infrastructure/implementations/datasources/product';
import { ProductRepositoryImpl } from '@infrastructure/implementations/repositories/product';
import { Router } from 'express';

export class ProductRoutes {
  constructor(
    public readonly router = Router(),
    private readonly datasource: ProductDataSource = new ProductDataSourceImpl(),
  ) {
    this.repository = new ProductRepositoryImpl(this.datasource);
    this.createProductUsecases = new CreateProduct(this.repository);
    this.controller = new ProductController(this.createProductUsecases);
    this.routes();
  }

  private readonly repository: ProductRepository;
  private readonly createProductUsecases: CreateProductUseCase;
  private readonly controller: ProductController;

  routes(): void {
    this.router.post('/create', this.controller.create);
  }
}
