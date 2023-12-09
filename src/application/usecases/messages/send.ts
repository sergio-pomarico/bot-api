import { WhatsAppMessageDTO } from '@domain/dtos';
import {
  ClientEntity,
  OrderEntity,
  WhatsAppMessage,
  WhatsAppMessageResult,
} from '@domain/entities';
import { CacheManager } from '@infrastructure/services/cache';
import services from '@infrastructure/services/api';
import { ConversationScript } from './script';
import { MessageResponse } from './response';
import { ClientRepository } from '@domain/repositories/client';
import { OrderQuestionResponse } from './questions';

export interface SendMessageUseCase {
  run: (
    messageDTO: WhatsAppMessageDTO,
  ) => Promise<WhatsAppMessageResult | null>;
}

export interface ConversationStep {
  step: number;
  client: ClientEntity | undefined;
  order: OrderEntity | undefined;
}

const inistialAnswers: ConversationStep = {
  step: 0,
  client: undefined,
  order: undefined,
};

export class SendMessage implements SendMessageUseCase {
  constructor(
    private readonly repository: ClientRepository,
    private readonly cache: CacheManager = new CacheManager(),
    private readonly responses = new MessageResponse(),
    private readonly script = new ConversationScript(),
  ) {}

  private steps: ConversationStep = inistialAnswers;

  updateStep = async (messageDTO: WhatsAppMessageDTO) => {
    this.steps.step++;
    await this.cache.set(messageDTO!.destination, this.steps);
  };

  setStep = async (step: number, messageDTO: WhatsAppMessageDTO) => {
    this.steps.step = step;
    await this.cache.set(messageDTO!.destination, this.steps);
  };

  resetSteps = () => {
    this.steps = inistialAnswers;
  };

  updateOrder = async (
    key: string,
    response: string | number | Date,
    messageDTO: WhatsAppMessageDTO,
  ) => {
    this.steps.order = { ...this.steps.order, ...{ [key]: response } };
    await this.cache.set(messageDTO!.destination, this.steps);
  };

  updateClient = async (
    key: string,
    response: string | number | Date,
    messageDTO: WhatsAppMessageDTO,
  ) => {
    this.steps.client = { ...this.steps.client, ...{ [key]: response } };
    await this.cache.set(messageDTO!.destination, this.steps);
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
        if (response === OrderQuestionResponse.REVIEW_THE_MENU) {
          //Send menu
          message = this.script.question(currentStep, messageDTO!.destination);
          if (message) {
            //4. update steps and responses
            await this.updateStep(messageDTO);
            //5. send message
            const result = await services.send(message!);
            return result;
          }
        } else if (response === OrderQuestionResponse.MAKE_A_ORDER) {
          await this.setStep(3, messageDTO);
          return null;
        } else {
          return null;
        }
      }
      if (currentStep === 2) {
        message = this.script.question(currentStep, messageDTO!.destination);
        if (message) {
          //4. update steps and responses
          await this.updateStep(messageDTO);
          //5. send message
          const result = await services.send(message!);
          return result;
        }
      }
      if (currentStep === 3) {
        //TODO: Check if user is register
        return null;
      }
      return null;
    } else {
      this.resetSteps();
      message = this.script.question(
        0,
        messageDTO!.destination,
        messageDTO!.name,
      );
      const result = await services.send(message);
      await this.updateStep(messageDTO);
      return result;
    }
  };
}
