import { env } from '@shared/utils';
import { Request, Response } from 'express';
import { WhatsAppMessageDTO } from '@domain/dtos';
import {
  SendMessage,
  SendMessageUseCase,
} from '@application/usecases/messages/send';

const MODE = 'subscribe';

export class WhatsAppController {
  constructor() {
    this.sendMessageUsecase = new SendMessage();
  }

  private readonly sendMessageUsecase: SendMessageUseCase;

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
    const [error, messageDTO] = WhatsAppMessageDTO.create(req);
    if (error) return res.status(400).json({ error });
    this.sendMessageUsecase
      .run(messageDTO!)
      .then(() => {
        return res.sendStatus(200);
      })
      .catch((error) => {
        console.error(error);
        return res.sendStatus(401);
      });
  };
}
