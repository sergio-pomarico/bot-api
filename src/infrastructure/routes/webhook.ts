import {
  SendMessage,
  SendMessageUseCase,
} from '@application/usecases/messages/send';
import {
  CategoryDataSource,
  ClientDataSource,
  ProductDataSource,
} from '@domain/datasources';
import {
  CategoryRepository,
  ClientRepository,
  ProductRepository,
} from '@domain/repositories';
import { WhatsAppController } from '@infrastructure/controllers/whatsapp';
import { ClientDataSourceImpl } from '@infrastructure/implementations/datasources/client';
import { ClientRepositoryImpl } from '@infrastructure/implementations/repositories/client';
import { CategoryRepositoryImpl } from '@infrastructure/implementations/repositories/category';
import { Router } from 'express';
import { CategoryDataSourceImpl } from '@infrastructure/implementations/datasources/category';
import { ProductDataSourceImpl } from '@infrastructure/implementations/datasources/product';
import { ProductRepositoryImpl } from '@infrastructure/implementations/repositories/product';

export class WebHookRoutes {
  constructor(
    public readonly router = Router(),
    private readonly clientDatasource: ClientDataSource = new ClientDataSourceImpl(),
    private readonly categoryDatasource: CategoryDataSource = new CategoryDataSourceImpl(),
    private readonly productDatasource: ProductDataSource = new ProductDataSourceImpl(),
  ) {
    this.clientRepository = new ClientRepositoryImpl(this.clientDatasource);
    this.categoryRepository = new CategoryRepositoryImpl(
      this.categoryDatasource,
    );
    this.productRepository = new ProductRepositoryImpl(this.productDatasource);
    this.sendMessageUsecase = new SendMessage(
      this.clientRepository,
      this.categoryRepository,
      this.productRepository,
    );
    this.controller = new WhatsAppController(this.sendMessageUsecase);
    this.routes();
  }

  private readonly clientRepository: ClientRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly productRepository: ProductRepository;
  private readonly sendMessageUsecase: SendMessageUseCase;

  private readonly controller: WhatsAppController;

  routes(): void {
    this.router.get('/webhook', this.controller.challenge);
    this.router.post('/webhook', this.controller.webhook);
  }
}
