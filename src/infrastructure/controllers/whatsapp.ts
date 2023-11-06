import { WhatsAppMessageResponse } from '@domain/entities/messages';
import { env } from '@shared/utils';
import { Request, Response } from 'express';

const MODE = 'subscribe';

export class WhatsAppController {
  challenge = async (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === MODE && token === env.whatsapp.challenge) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  };
  webhook = async (req: Request, res: Response) => {
    const whatsAppMessage: WhatsAppMessageResponse = req.body;
    const { contacts, messages } = whatsAppMessage.entry[0].changes[0].value;
    console.log(contacts[0].profile, messages[0]);
    return res.sendStatus(200);
  };
}
