import { Router } from 'express';
import { AuthController } from '../controllers/auth';
import { AuthDataRepositoryImpl } from '../implementations/repositories/auth';
import { AuthDataSourceImpl } from '../implementations/datasources/auth';
import { CreateUser, LoginUser } from '@application/usecases/user';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const dataSource = new AuthDataSourceImpl();
    const repository = new AuthDataRepositoryImpl(dataSource);
    const registerUsecases = new CreateUser(repository);
    const loginUsecases = new LoginUser(repository);
    const controller = new AuthController(registerUsecases, loginUsecases);

    router.post('/register', controller.register);
    router.post('/login', controller.login);

    return router;
  }
}
