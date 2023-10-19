import { Request, Response } from 'express';

export class AuthController {
  login = (__: Request, res: Response) => {
    res.status(200).json({
      login: true,
    });
  };
}
