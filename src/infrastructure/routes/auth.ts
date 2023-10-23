import { AuthController } from '../controllers/auth';
import { BaseRouter } from './base';

export class AuthRouter extends BaseRouter<AuthController> {
  constructor() {
    super(AuthController);
  }

  routes(): void {
    this.router.post('/auth/register', this.controller.register);
  }
}
