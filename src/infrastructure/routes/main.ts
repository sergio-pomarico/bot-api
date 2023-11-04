import { Router } from 'express';
import { AuthRoutes } from './auth';
import { WebHookRoutes } from './webhook';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/auth', new AuthRoutes().router);
    router.use('/whatsapp', new WebHookRoutes().router);

    return router;
  }
}
