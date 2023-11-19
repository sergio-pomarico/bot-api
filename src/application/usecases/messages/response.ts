import { WhatsAppResponse } from '@domain/entities';
import { MessageType } from '@domain/entities/whatsapp/response';

export class MessageResponse {
  parse = (response: WhatsAppResponse) => {
    let data: string | undefined;
    const type: MessageType =
      response.entry?.[0].changes?.[0].value.messages?.[0].type;
    switch (type) {
      case 'text':
        data = response.entry?.[0].changes?.[0].value.messages?.[0].text?.body;
        break;
      case 'interactive':
        data =
          response.entry?.[0].changes?.[0].value.messages?.[0].interactive
            .interactive.button_reply.id;
        break;
      default:
        break;
    }
    return data!;
  };
}
