import { WhatsAppMessage } from '@domain/entities';
import { MessageBuilder, MessageBuilderHelper } from './build';

export class ConversationScript {
  constructor(
    private readonly builder: MessageBuilderHelper = new MessageBuilder(),
  ) {}
  question = (step: number, destination: string): WhatsAppMessage => {
    let message: WhatsAppMessage;
    switch (step) {
      case 0:
        message = this.builder.buildTextMessage(
          destination,
          '¿Cuál es tu nombre?',
          false,
        );
        break;
      case 1:
        message = this.builder.buildTextMessage(
          destination,
          '¿Cuál es tu dirección?',
          false,
        );
        break;
      case 2:
        message = this.builder.buildTextMessage(
          destination,
          'Por favor ingresa tu número de documento',
          false,
        );
        break;

      default:
        break;
    }
    return message!;
  };
}
