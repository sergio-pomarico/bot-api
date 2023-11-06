import { NextFunction, Request, Response } from 'express';
import { verifySignature } from '@shared/utils/crypto';

export class WhatsAppMiddleware {
  static async validateHeaders(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const isValid = verifySignature(req);
    if (isValid) {
      next();
    } else {
      return res.status(401).json({ message: 'Invalid signature' });
    }
  }
}
