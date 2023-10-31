import { Router } from 'express';
import { AuthRoutes } from './routes/auth';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/auth', new AuthRoutes().router);

    return router;
  }
}
