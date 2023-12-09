import { WhatsAppMessage } from '@domain/entities';
import {
  menuQuestion,
  makeOrderQuestion,
  makeOnlyOrderQuestion,
} from './questions';

export class ConversationScript {
  question = (
    step: number,
    destination: string,
    name?: string,
  ): WhatsAppMessage => {
    let message: WhatsAppMessage;
    switch (step) {
      case 0:
        message = makeOrderQuestion(destination, name);
        break;
      case 1:
        message = menuQuestion(destination);
        break;
      case 2:
        message = makeOnlyOrderQuestion(destination);
        break;
      default:
        break;
    }
    return message!;
  };
}
