import { Request, Response } from 'express';
import { RegisterUserDTO } from '@domain/dtos';
import { AuthRepository } from '@domain/repositories/auth';
import { CustomHTTPError } from '@domain/errors/custom';
import { JWTAdapter } from '../../utils';

export class AuthController {
  constructor(private readonly repository: AuthRepository) {}
  handlerError = (error: unknown, res: Response) => {
    if (error instanceof CustomHTTPError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  };
  register = async (req: Request, res: Response) => {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) return res.status(400).json({ error });
    this.repository
      .register(registerUserDTO!)
      .then(async (user) => {
        const token = await JWTAdapter.generateToken({ id: user?.id });
        return res.status(200).json({ user, token });
      })
      .catch((error) => this.handlerError(error, res));
  };
}
