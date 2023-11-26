import { WhatsAppMessageDTO } from '@domain/dtos';
import {
  ClientEntity,
  OrderEntity,
  OrderType,
  REVIEW_THE_MENU,
  WhatsAppMessage,
  WhatsAppMessageResult,
} from '@domain/entities';
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
  client: ClientEntity | undefined;
  order: OrderEntity | undefined;
}

export interface Answer {
  id: string;
  answer: string;
}

const inistialAnswers: ConversationStep = {
  step: 0,
  client: undefined,
  order: undefined,
};

export class SendMessage implements SendMessageUseCase {
  constructor(
    private readonly cache: CacheManager = new CacheManager(),
    private readonly responses = new MessageResponse(),
    private readonly script = new ConversationScript(),
  ) {}

  private steps: ConversationStep = inistialAnswers;

  updateStep = async (messageDTO: WhatsAppMessageDTO) => {
    this.steps.step++;
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
        if (response === REVIEW_THE_MENU) {
          //Send menu
        } else if (
          response === OrderType.HOME_DELIVERY ||
          response === OrderType.PICK_UP_AT_RESTAURANT
        ) {
          await this.updateOrder('type', response, messageDTO);
          message = this.script.question(currentStep, messageDTO!.destination);
          if (message) {
            //4. update steps and responses
            await this.updateStep(messageDTO);

            //5. send message
            const result = await services.send(message!);

            //6. save data in DB
            return result;
          }
        } else {
          return null;
        }
      }
      if (currentStep === 2) {
        if (
          response === '1' ||
          response === '2' ||
          response === '3' ||
          response === '4'
        ) {
          await this.updateOrder('restaurantId', response, messageDTO);
          message = this.script.question(currentStep, messageDTO!.destination);
          if (!message) {
            this.resetSteps();
            return null;
          }
        } else {
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
