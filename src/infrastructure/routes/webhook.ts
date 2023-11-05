import { WhatsAppController } from '@infrastructure/controllers/whatsapp';
import { Router } from 'express';

export class WebHookRoutes {
  constructor(public readonly router = Router()) {
    this.controller = new WhatsAppController();
    this.routes();
  }

  private readonly controller: WhatsAppController;

  routes(): void {
    this.router.get('/webhook', this.controller.challenge);
    this.router.post('/webhook', this.controller.webhook);
  }
}
