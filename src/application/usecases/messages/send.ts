import { WhatsAppMessageDTO } from '@domain/dtos';
import { WhatsAppMessage, WhatsAppMessageResult } from '@domain/entities';
import { CacheManager } from '@infrastructure/cache';
import services from '@infrastructure/services/api';
import { MessageBuilder, MessageBuilderHelper } from './build';
import { ConversationScript } from './script';

export interface SendMessageUseCase {
  run: (messageDTO: WhatsAppMessageDTO) => Promise<WhatsAppMessageResult>;
}

export interface ConversationStep {
  step: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  answer: string;
}

export class SendMessage implements SendMessageUseCase {
  constructor(
    private readonly cache: CacheManager = new CacheManager(),
    private readonly builder: MessageBuilderHelper = new MessageBuilder(),
  ) {
    this.script = new ConversationScript();
  }
  private steps: ConversationStep = { step: 0, answers: [] };
  private script: ConversationScript;

  updateStep = () => {
    this.steps.step++;
  };

  run = async (
    messageDTO: WhatsAppMessageDTO,
  ): Promise<WhatsAppMessageResult> => {
    const currentConversationStep: ConversationStep | undefined =
      (await this.cache.get(messageDTO!.destination)) as ConversationStep;
    let message: WhatsAppMessage;

    if (currentConversationStep !== null) {
      this.steps = currentConversationStep;
      const { step: currentStep } = this.steps;
      message = this.script.question(currentStep, messageDTO!.destination);

      this.updateStep();
      await this.cache.set(messageDTO!.destination, this.steps, 300000);
      const result = await services.send(message!);
      return result;
    } else {
      const message = this.builder.buildTextMessage(
        messageDTO!.destination,
        'Mensaje de bienvenida',
        false,
      );
      this.updateStep();
      await this.cache.set(messageDTO!.destination, this.steps, 300000);
      const result = await services.send(message);
      return result;
    }
  };
}
