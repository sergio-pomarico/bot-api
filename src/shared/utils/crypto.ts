import { Request } from 'express';
import { createHmac } from 'node:crypto';
import { env } from './env';

export const verifySignature = (req: Request) => {
  const signature = createHmac('sha256', env.whatsapp.secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  const receivedSignature = req.headers['x-hub-signature-256'] ?? '';
  const calculatedSignature = `sha256=${signature}`;
  return receivedSignature === calculatedSignature;
};
