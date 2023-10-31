import { Router } from 'express';
import { AuthController } from '../controllers/auth';
import { AuthDataRepositoryImpl } from '../implementations/repositories/auth';
import { AuthDataSourceImpl } from '../implementations/datasources/auth';
import { CreateUser, LoginUser } from '@application/usecases/user';
import { AuthDataSource } from '@domain/datasources';
import { AuthRepository } from '@domain/repositories';

export class AuthRoutes {
  constructor(
    public readonly router = Router(),
    private readonly datasource: AuthDataSource = new AuthDataSourceImpl(),
  ) {
    this.repository = new AuthDataRepositoryImpl(this.datasource);
    this.createUserUsecases = new CreateUser(this.repository);
    this.loginUsecases = new LoginUser(this.repository);
    this.controller = new AuthController(
      this.createUserUsecases,
      this.loginUsecases,
    );
    this.routes();
  }

  private readonly repository: AuthRepository;
  private readonly createUserUsecases: CreateUser;
  private readonly loginUsecases: LoginUser;
  private readonly controller: AuthController;

  routes(): void {
    this.router.post('/register', this.controller.register);
    this.router.post('/login', this.controller.login);
  }
}
