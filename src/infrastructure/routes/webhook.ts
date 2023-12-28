import {
  SendMessage,
  SendMessageUseCase,
} from '@application/usecases/messages/send';
import { ClientDataSource } from '@domain/datasources';
import { ClientRepository } from '@domain/repositories';
import { WhatsAppController } from '@infrastructure/controllers/whatsapp';
import { ClientDataSourceImpl } from '@infrastructure/implementations/datasources/client';
import { ClientDataRepositoryImpl } from '@infrastructure/implementations/repositories/client';
import { Router } from 'express';

export class WebHookRoutes {
  constructor(
    public readonly router = Router(),
    private readonly datasource: ClientDataSource = new ClientDataSourceImpl(),
  ) {
    this.repository = new ClientDataRepositoryImpl(this.datasource);
    this.sendMessageUsecase = new SendMessage(this.repository);
    this.controller = new WhatsAppController(this.sendMessageUsecase);
    this.routes();
  }

  private readonly repository: ClientRepository;
  private readonly sendMessageUsecase: SendMessageUseCase;

  private readonly controller: WhatsAppController;

  routes(): void {
    this.router.get('/webhook', this.controller.challenge);
    this.router.post('/webhook', this.controller.webhook);
  }
}
