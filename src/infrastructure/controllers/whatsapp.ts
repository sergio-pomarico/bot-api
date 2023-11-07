import {
  WhatsAppUserResponseMessage,
  WhatssAppTextMessagePayload,
} from '@domain/entities/whatsapp';
import services from '@infrastructure/services/api';
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
    try {
      const whatsAppMessage: WhatsAppUserResponseMessage = req.body;
      const { contacts, messages } = whatsAppMessage.entry[0].changes[0].value;
      const number = messages[0].from ?? '';
      const name = contacts[0].profile.name ?? '';
      const message: WhatssAppTextMessagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'text',
        text: {
          preview_url: false,
          body: `Hola ${name} en que te podemos ayudar.`,
        },
      };
      await services.send(message);
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.sendStatus(401);
    }
  };
}
