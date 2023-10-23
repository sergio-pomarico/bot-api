import { Request, Response } from 'express';
import { RegisterUserDTO } from '../../domain/dtos/register';

export class AuthController {
  register = (req: Request, res: Response) => {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) return res.status(400).json({ error });
    res.status(200).json(registerUserDTO);
  };
}
