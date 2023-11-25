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
        if (
          response.entry?.[0].changes?.[0].value.messages?.[0].interactive
            .type === 'button_reply'
        ) {
          data =
            response.entry?.[0].changes?.[0].value.messages?.[0].interactive
              ?.button_reply?.id;
        } else {
          data =
            response.entry?.[0].changes?.[0].value.messages?.[0].interactive
              ?.list_reply?.id;
        }
        break;
      default:
        break;
    }
    return data!;
  };
}
