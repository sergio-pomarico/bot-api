import { Router } from 'express';
import { AuthController } from '../controllers/auth';
import { AuthDataRepositoryImpl } from '../implementations/repositories/auth';
import { AuthDataSourceImpl } from '../implementations/datasources/auth';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const dataSource = new AuthDataSourceImpl();
    const repository = new AuthDataRepositoryImpl(dataSource);
    const controller = new AuthController(repository);

    router.post('/register', controller.register);

    return router;
  }
}
