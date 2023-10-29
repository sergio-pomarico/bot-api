import { Request, Response } from 'express';
import { LoginUserDTO, RegisterUserDTO } from '@domain/dtos';
import { CustomHTTPError } from '@domain/errors/custom';
import { CreateUserUseCase } from '@application/usecases/user/create';
import { LoginUserUseCase } from '@application/usecases/user/login';

export class AuthController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

  handlerError = (error: unknown, res: Response) => {
    if (error instanceof CustomHTTPError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  };

  login = async (req: Request, res: Response) => {
    const [error, loginUserDTO] = LoginUserDTO.create(req.body);
    if (error) return res.status(400).json({ error });
    this.loginUser
      .run(loginUserDTO!)
      .then(async (response) => {
        const { token, user: userId } = response;
        return res.status(200).json({ userId, token });
      })
      .catch((error) => this.handlerError(error, res));
  };

  register = async (req: Request, res: Response) => {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) return res.status(400).json({ error });
    this.createUser
      .run(registerUserDTO!)
      .then(async (response) => {
        const { token, user: userId } = response;
        return res.status(200).json({ userId, token });
      })
      .catch((error) => this.handlerError(error, res));
  };
}
