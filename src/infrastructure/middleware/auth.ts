import { JWTAdapter } from '@shared/utils';
import { NextFunction, Request, Response } from 'express';

interface DecodedToken {
  iat: number;
  id: string;
  exp: number;
}

export class AuthMiddleware {
  static async validateToken(req: Request, res: Response, next: NextFunction) {
    const { authorization: token } = req.headers;
    if (!token) {
      return res.status(401).json({ message: 'Invalid access token' });
    }
    try {
      const payload = await JWTAdapter.verifyToken<DecodedToken>(token);
      if (!payload)
        return res.status(401).json({ message: 'Invalid access token' });
      next();
    } catch (error) {
      if (error instanceof Error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
