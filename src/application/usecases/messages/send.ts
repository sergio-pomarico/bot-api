import { WhatsAppMessageDTO } from '@domain/dtos';
import { WhatsAppMessageResult } from '@domain/entities';
import { CacheManager } from '@infrastructure/cache';
import services from '@infrastructure/services/api';
import { MessageBuilder, MessageBuilderHelper } from './build';

export interface SendMessageUseCase {
  run: (messageDTO: WhatsAppMessageDTO) => Promise<WhatsAppMessageResult>;
}

export class SendMessage implements SendMessageUseCase {
  constructor(
    private readonly cache: CacheManager = new CacheManager(),
    private readonly builder: MessageBuilderHelper = new MessageBuilder(),
  ) {}
  run = async (
    messageDTO: WhatsAppMessageDTO,
  ): Promise<WhatsAppMessageResult> => {
    const message = this.builder.buildTextMessage(
      messageDTO!.destination,
      '¿Cual es tu documento de indentidad ?',
      false,
    );
    const result = await services.send(message);
    return result;
  };
}
