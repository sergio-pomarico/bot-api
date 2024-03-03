import {
  SendMessage,
  SendMessageUseCase,
} from '@application/usecases/messages/send';
import {
  CategoryRepository,
  ClientRepository,
  ProductAttributeRepository,
  ProductRepository,
  RestaurantRepository,
} from '@domain/repositories';
import { WhatsAppController } from '@infrastructure/controllers/whatsapp';
import {
  ClientRepositoryImpl,
  CategoryRepositoryImpl,
  ProductRepositoryImpl,
  ProductAttributeRepositoryImpl,
} from '@infrastructure/implementations/repositories';
import { RestaurantRepositoryImpl } from '@infrastructure/implementations/repositories/restaurant';
import { Router } from 'express';

export class WebHookRoutes {
  constructor(public readonly router = Router()) {
    this.clientRepository = new ClientRepositoryImpl();
    this.categoryRepository = new CategoryRepositoryImpl();
    this.productRepository = new ProductRepositoryImpl();
    this.productAttributeRepository = new ProductAttributeRepositoryImpl();
    this.restaurantRepository = new RestaurantRepositoryImpl();
    this.sendMessageUsecase = new SendMessage(
      this.clientRepository,
      this.categoryRepository,
      this.productRepository,
      this.restaurantRepository,
      this.productAttributeRepository,
    );
    this.controller = new WhatsAppController(this.sendMessageUsecase);
    this.routes();
  }

  private readonly clientRepository: ClientRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly productAttributeRepository: ProductAttributeRepository;
  private readonly productRepository: ProductRepository;
  private readonly restaurantRepository: RestaurantRepository;
  private readonly sendMessageUsecase: SendMessageUseCase;

  private readonly controller: WhatsAppController;

  routes(): void {
    this.router.get('/webhook', this.controller.challenge);
    this.router.post('/webhook', this.controller.webhook);
  }
}
