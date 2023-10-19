import { AuthController } from '../controllers/auth';
import { BaseRouter } from './base';

export class AuthRouter extends BaseRouter<AuthController> {
  constructor() {
    super(AuthController);
  }

  routes(): void {
    this.router.get('/auth/login', this.controller.login);
  }
}
