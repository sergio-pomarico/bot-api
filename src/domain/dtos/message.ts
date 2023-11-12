import { WhatsAppResponse } from '@domain/entities';
import { Request } from 'express';
import { z } from 'zod';

const messageDTOValidator = z.string().length(12).startsWith('57');

export default class WhatsAppMessageDTO {
  private constructor(public destination: string) {}

  static getUserData = (
    req: Request,
  ): { profile: string; wa_id: string } | null => {
    try {
      const whatsAppMessage: WhatsAppResponse = req.body;
      const { entry } = whatsAppMessage;
      if (entry && entry.length > 0) {
        const {
          value: {
            contacts: [{ profile, wa_id }],
          },
        } = entry[0].changes[0];
        return { profile: profile.name, wa_id };
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  static create(req: Request): [Error?, WhatsAppMessageDTO?] {
    const userInfo = this.getUserData(req);
    const result = messageDTOValidator.safeParse(userInfo?.wa_id);
    if (!result.success) return [result.error, undefined];
    return [undefined, new WhatsAppMessageDTO(userInfo!.wa_id)];
  }
}
