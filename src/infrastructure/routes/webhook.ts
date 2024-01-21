import {
  SendMessage,
  SendMessageUseCase,
} from '@application/usecases/messages/send';
import {
  CategoryRepository,
  ClientRepository,
  ProductRepository,
} from '@domain/repositories';
import { WhatsAppController } from '@infrastructure/controllers/whatsapp';
import { ClientRepositoryImpl } from '@infrastructure/implementations/repositories/client';
import { CategoryRepositoryImpl } from '@infrastructure/implementations/repositories/category';
import { Router } from 'express';
import { ProductRepositoryImpl } from '@infrastructure/implementations/repositories/product';

export class WebHookRoutes {
  constructor(public readonly router = Router()) {
    this.clientRepository = new ClientRepositoryImpl();
    this.categoryRepository = new CategoryRepositoryImpl();
    this.productRepository = new ProductRepositoryImpl();
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
