import {
  SendMessage,
  SendMessageUseCase,
} from '@application/usecases/messages/send';
import { CategoryDataSource, ClientDataSource } from '@domain/datasources';
import { CategoryRepository, ClientRepository } from '@domain/repositories';
import { WhatsAppController } from '@infrastructure/controllers/whatsapp';
import { ClientDataSourceImpl } from '@infrastructure/implementations/datasources/client';
import { ClientRepositoryImpl } from '@infrastructure/implementations/repositories/client';
import { CategoryRepositoryImpl } from '@infrastructure/implementations/repositories/category';
import { Router } from 'express';
import { CategoryDataSourceImpl } from '@infrastructure/implementations/datasources/category';

export class WebHookRoutes {
  constructor(
    public readonly router = Router(),
    private readonly clientDatasource: ClientDataSource = new ClientDataSourceImpl(),
    private readonly categoryDatasource: CategoryDataSource = new CategoryDataSourceImpl(),
  ) {
    this.clientRepository = new ClientRepositoryImpl(this.clientDatasource);
    this.categoryRepository = new CategoryRepositoryImpl(
      this.categoryDatasource,
    );
    this.sendMessageUsecase = new SendMessage(
      this.clientRepository,
      this.categoryRepository,
    );
    this.controller = new WhatsAppController(this.sendMessageUsecase);
    this.routes();
  }

  private readonly clientRepository: ClientRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly sendMessageUsecase: SendMessageUseCase;

  private readonly controller: WhatsAppController;

  routes(): void {
    this.router.get('/webhook', this.controller.challenge);
    this.router.post('/webhook', this.controller.webhook);
  }
}
