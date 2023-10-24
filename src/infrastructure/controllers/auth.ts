import { Request, Response } from 'express';
import { RegisterUserDTO } from '../../domain/dtos/register';
import { AuthRepository } from '../../domain/repositories/auth';

export class AuthController {
  constructor(private readonly repository: AuthRepository) {}
  register = (req: Request, res: Response) => {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) return res.status(400).json({ error });
    this.repository
      .register(registerUserDTO!)
      .then((user) => res.status(200).json(user))
      .catch((error) => res.json(error));
  };
}
