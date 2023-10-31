import { Request, Response } from 'express';
import { LoginUserDTO, RegisterUserDTO } from '@domain/dtos';
import { CustomHTTPError } from '@domain/errors/custom';
import {
  CreateUserUseCase,
  LoginUserUseCase,
} from '@application/usecases/user';

export class AuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

  handlerError = (error: unknown, res: Response) => {
    if (error instanceof CustomHTTPError) {
      return res.status(error.httpCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  };

  login = async (req: Request, res: Response) => {
    const [error, loginDTO] = LoginUserDTO.create(req.body);
    if (error) return res.status(400).json({ error });
    this.loginUser
      .run(loginDTO!)
      .then(async (response) => {
        return res.status(200).json({ ...response });
      })
      .catch((error) => this.handlerError(error, res));
  };

  register = async (req: Request, res: Response) => {
    const [error, registerDTO] = RegisterUserDTO.create(req.body);
    if (error) return res.status(400).json({ error });
    this.createUser
      .run(registerDTO!)
      .then(async (response) => {
        const { token, userId } = response;
        return res.status(200).json({ userId, token });
      })
      .catch((error) => this.handlerError(error, res));
  };
}
