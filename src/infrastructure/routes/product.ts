import {
  CreateProductUseCase,
  CreateProduct,
} from '@application/usecases/product/create';
import { ProductRepository } from '@domain/repositories';
import { ProductController } from '@infrastructure/controllers/product';
import { ProductRepositoryImpl } from '@infrastructure/implementations/repositories';
import { Router } from 'express';

export class ProductRoutes {
  constructor(public readonly router = Router()) {
    this.repository = new ProductRepositoryImpl();
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
