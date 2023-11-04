import { env } from '@shared/utils';
import { Request, Response } from 'express';

const MODE = 'subscribe';

export class WhatsAppController {
  challenge = async (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === MODE && token === env.whatsapp) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  };
}
