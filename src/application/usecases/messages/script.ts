import { WhatsAppMessage } from '@domain/entities';
import { MessageBuilder, MessageBuilderHelper } from './build';

export class ConversationScript {
  constructor(
    private readonly builder: MessageBuilderHelper = new MessageBuilder(),
  ) {}
  question = (step: number, destination: string): WhatsAppMessage => {
    let message: WhatsAppMessage;
    switch (step) {
      case 1:
        message = this.builder.buildTextMessage(
          destination,
          'Segundo mensaje',
          false,
        );
        break;
      case 2:
        message = this.builder.buildTextMessage(
          destination,
          'Tercer mensaje',
          false,
        );
        break;

      default:
        break;
    }
    return message!;
  };
}
