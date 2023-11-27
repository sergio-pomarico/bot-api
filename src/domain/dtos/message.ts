import { WhatsAppResponse } from '@domain/entities';
import { Request } from 'express';
import { z } from 'zod';

const messageDTOValidator = z.string().length(12).startsWith('57');

export default class WhatsAppMessageDTO {
  private constructor(
    public destination: string,
    public name: string,
    public response: WhatsAppResponse,
  ) {}

  static info = (req: Request): { profile: string; wa_id: string } | null => {
    try {
      const whatsAppMessage: WhatsAppResponse = req.body;
      const number =
        whatsAppMessage.entry[0].changes[0].value.contacts?.[0].wa_id;
      const name =
        req.body.entry[0].changes[0].value.contacts?.[0]?.profile?.name ??
        undefined;
      return { profile: name, wa_id: number };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  static create(req: Request): [Error?, WhatsAppMessageDTO?] {
    const info = this.info(req);
    const result = messageDTOValidator.safeParse(info?.wa_id);
    if (!result.success) return [result.error, undefined];
    return [
      undefined,
      new WhatsAppMessageDTO(info!.wa_id, info!.profile, req.body),
    ];
  }
}
