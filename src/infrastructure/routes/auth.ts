import { Router } from 'express';
import { AuthController } from '../controllers/auth';
import { AuthDataRepositoryImpl } from '../implementations/repositories/auth';
import { AuthDataSourceImpl } from '../implementations/datasources/auth';
import { CreateUser } from '@application/usecases/user/create';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const dataSource = new AuthDataSourceImpl();
    const repository = new AuthDataRepositoryImpl(dataSource);
    const usecases = new CreateUser(repository);
    const controller = new AuthController(usecases);

    router.post('/register', controller.register);

    return router;
  }
}
