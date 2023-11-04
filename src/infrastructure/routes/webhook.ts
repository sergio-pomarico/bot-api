import { WhatsAppController } from '@infrastructure/controllers/whatsapp';
import { Request, Response, Router } from 'express';

export class WebHookRoutes {
  constructor(public readonly router = Router()) {
    this.controller = new WhatsAppController();
    this.routes();
  }

  private readonly controller: WhatsAppController;

  routes(): void {
    this.router.get('/webhook', this.controller.challenge);
    this.router.post('/webhook', (req: Request, res: Response) => {
      console.log(JSON.stringify(req.body));
      res.sendStatus(200);
    });
  }
}
