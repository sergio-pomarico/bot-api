import { WhatsAppMessageDTO } from '@domain/dtos';
import {
  WhatsAppMessage,
  WhatsAppMessageResult,
  WhatsAppResponse,
} from '@domain/entities';
import { CacheManager } from '@infrastructure/cache';
import services from '@infrastructure/services/api';
import { ConversationScript } from './script';

export interface SendMessageUseCase {
  run: (
    messageDTO: WhatsAppMessageDTO,
  ) => Promise<WhatsAppMessageResult | null>;
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
  constructor(private readonly cache: CacheManager = new CacheManager()) {
    this.script = new ConversationScript();
  }
  private steps: ConversationStep = { step: 0, answers: [] };
  private script: ConversationScript;

  updateStep = () => {
    this.steps.step++;
  };

  resetSteps = () => {
    this.steps = { step: 0, answers: [] };
  };

  updateAnswes = (response: string) => {
    response;
    this.steps.answers.push({
      id: this.steps.step.toString(),
      answer: response,
    });
  };

  getMessageResponse = (response: WhatsAppResponse) => {
    if (response.entry && response.entry.length > 0) {
      const { changes } = response.entry[0];
      if (changes && changes.length > 0) {
        const {
          value: { messages },
        } = changes[0];
        if (messages && messages.length > 0) {
          const { text } = messages[0];
          return text.body;
        }
      }
    }
    return null;
  };

  run = async (
    messageDTO: WhatsAppMessageDTO,
  ): Promise<WhatsAppMessageResult | null> => {
    const currentConversationStep: ConversationStep | undefined =
      (await this.cache.get(messageDTO!.destination)) as ConversationStep;
    let message: WhatsAppMessage;
    if (currentConversationStep !== null) {
      this.steps = currentConversationStep;
      const { step: currentStep } = this.steps;
      this.updateAnswes(this.getMessageResponse(messageDTO!.response) ?? '');
      message = this.script.question(currentStep, messageDTO!.destination);
      if (message) {
        this.updateStep();
        await this.cache.set(messageDTO!.destination, this.steps);
        const result = await services.send(message!);
        return result;
      } else {
        return null;
      }
    } else {
      message = this.script.question(0, messageDTO!.destination);
      this.resetSteps();
      this.updateStep();
      await this.cache.set(messageDTO!.destination, this.steps);
      const result = await services.send(message);
      return result;
    }
  };
}
