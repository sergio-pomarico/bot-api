import { WhatsAppMessageDTO } from '@domain/dtos';
import { WhatsAppMessage, WhatsAppMessageResult } from '@domain/entities';
import { CacheManager } from '@infrastructure/cache';
import services from '@infrastructure/services/api';
import { ConversationScript } from './script';
import { MessageResponse } from './response';

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
  constructor(
    private readonly cache: CacheManager = new CacheManager(),
    private readonly responses = new MessageResponse(),
    private readonly script = new ConversationScript(),
  ) {}

  private steps: ConversationStep = { step: 0, answers: [] };

  updateStep = async (messageDTO: WhatsAppMessageDTO) => {
    this.steps.step++;
    await this.cache.set(messageDTO!.destination, this.steps);
  };

  resetSteps = () => {
    this.steps = { step: 0, answers: [] };
  };

  updateAnswes = (response: string) => {
    this.steps.answers.push({
      id: this.steps.step.toString(),
      answer: response,
    });
  };

  run = async (
    messageDTO: WhatsAppMessageDTO,
  ): Promise<WhatsAppMessageResult | null> => {
    const currentConversationStep: ConversationStep | null =
      (await this.cache.get(messageDTO!.destination)) as ConversationStep;
    let message: WhatsAppMessage;
    if (currentConversationStep !== null) {
      //1 get the current step
      this.steps = currentConversationStep;
      const { step: currentStep } = this.steps;

      //2. get user response
      const response = this.responses.parse(messageDTO!.response);

      //3. validate user response
      if (currentStep === 1) {
        if (response === 'REVIEW_THE_MENU') {
          //Send menu
        } else {
          this.updateAnswes(response);
          message = this.script.question(currentStep, messageDTO!.destination);
          if (message) {
            //4. update steps and responses
            this.updateStep(messageDTO);

            //5. send message
            const result = await services.send(message!);

            //6. save data in DB
            return result;
          }
        }
      }
      if (currentStep === 2) {
        this.updateAnswes(response);
        message = this.script.question(currentStep, messageDTO!.destination);
        if (!message) {
          this.updateStep(messageDTO);
          return null;
        }
      }
      return null;
    } else {
      this.resetSteps();
      message = this.script.question(0, messageDTO!.destination);
      const result = await services.send(message);
      await this.updateStep(messageDTO);
      return result;
    }
  };
}
