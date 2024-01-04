import { Router } from 'express';
import { AuthRoutes } from './auth';
import { CategoryRoutes } from './category';
import { WebHookRoutes } from './webhook';
import { ProductRoutes } from './product';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/auth', new AuthRoutes().router);
    router.use('/whatsapp', new WebHookRoutes().router);
    router.use('/category', new CategoryRoutes().router);
    router.use('/product', new ProductRoutes().router);

    return router;
  }
}
