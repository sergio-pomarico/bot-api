import { differenceInDays } from 'date-fns';
import { ClientDTO, WhatsAppMessageDTO } from '@domain/dtos';
import {
  ClientEntity,
  OrderEntity,
  WhatsAppMessageResult,
} from '@domain/entities';
import { CacheManager } from '@infrastructure/services/cache';
import services from '@infrastructure/services/api';
import { ConversationScript, ScriptStep } from './script';
import { MessageResponse } from './response';
import { ClientRepository } from '@domain/repositories/client';
import {
  OrderQuestionResponse,
  TyCQuestionResponse,
  clientConfirmationQuestion,
} from './questions';
import { ClientQuestionResponse } from './questions/client';

export interface SendMessageUseCase {
  run: (
    messageDTO: WhatsAppMessageDTO,
  ) => Promise<WhatsAppMessageResult | null>;
}

export interface ConversationStep {
  step: ScriptStep;
  client: ClientEntity | undefined;
  order: OrderEntity | undefined;
}

const inistialAnswers: ConversationStep = {
  step: ScriptStep.INITIAL,
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

  setStep = async (step: ScriptStep, messageDTO: WhatsAppMessageDTO) => {
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

  sendMessage = async (
    step: ScriptStep,
    messageDTO: WhatsAppMessageDTO,
  ): Promise<WhatsAppMessageResult> => {
    const message = this.script.question(step, messageDTO!.destination);
    await this.setStep(step, messageDTO);
    const result = await services.send(message!);
    return result;
  };

  run = async (
    messageDTO: WhatsAppMessageDTO,
  ): Promise<WhatsAppMessageResult | null> => {
    const currentConversationStep: ConversationStep | null =
      (await this.cache.get(messageDTO!.destination)) as ConversationStep;
    if (currentConversationStep !== null) {
      this.steps = currentConversationStep;
      const { step: currentStep } = this.steps;

      const response = this.responses.parse(messageDTO!.response);

      if ((currentStep as ScriptStep) === ScriptStep.WELCOME) {
        if (response === OrderQuestionResponse.REVIEW_THE_MENU) {
          const result = await this.sendMessage(ScriptStep.MENU, messageDTO);
          return result;
        } else if (response === OrderQuestionResponse.MAKE_A_ORDER) {
          const client = await this.repository.find(messageDTO!.destination);
          if (client === null) {
            const result = await this.sendMessage(ScriptStep.TYC, messageDTO);
            return result;
          } else {
            //check if client updatedAt is lessthan 3 months
            if (differenceInDays(new Date(), client.updatedAt!) >= 90) {
              const result = await this.sendMessage(
                ScriptStep.CLIENT_VERFIFY_NATIONAL_ID,
                messageDTO,
              );
              return result;
            } else {
              //send menu
            }
          }
          return null;
        } else {
          return null;
        }
      }
      if ((currentStep as ScriptStep) === ScriptStep.MENU) {
        if (response === OrderQuestionResponse.MAKE_A_ORDER) {
          const client = await this.repository.find(messageDTO!.destination);
          if (client === null) {
            const result = await this.sendMessage(ScriptStep.TYC, messageDTO);
            return result;
          } else {
            //check if client updatedAt is lessthan 3 months
            if (differenceInDays(new Date(), client.updatedAt!) >= 90) {
              const result = await this.sendMessage(
                ScriptStep.CLIENT_VERFIFY_NATIONAL_ID,
                messageDTO,
              );
              return result;
            } else {
              //send menu
            }
          }
        }
        return null;
      }
      if (
        (currentStep as ScriptStep) === ScriptStep.CLIENT_VERFIFY_NATIONAL_ID
      ) {
        const client = await this.repository.find(messageDTO!.destination);
        const { documentId } = client!;
        if (response === documentId?.toString().slice(-4)) {
          //send menu
        } else {
          //reject
        }
      }
      if ((currentStep as ScriptStep) === ScriptStep.TYC) {
        if (response === TyCQuestionResponse.ACCEPT_TYC) {
          const result = await this.sendMessage(
            ScriptStep.CLIENT_NAME,
            messageDTO,
          );
          return result;
        } else {
          // Reject TyC
        }
        return null;
      }
      if ((currentStep as ScriptStep) === ScriptStep.CLIENT_NAME) {
        await this.updateClient('fullname', response, messageDTO);
        const result = await this.sendMessage(
          ScriptStep.CLIENT_ADDRESS,
          messageDTO,
        );
        return result;
      }
      if ((currentStep as ScriptStep) === ScriptStep.CLIENT_ADDRESS) {
        await this.updateClient('address', response, messageDTO);
        const result = await this.sendMessage(
          ScriptStep.CLIENT_NATIONAL_ID,
          messageDTO,
        );
        return result;
      }
      if ((currentStep as ScriptStep) === ScriptStep.CLIENT_NATIONAL_ID) {
        await this.updateClient('documentId', response, messageDTO);
        const { client } = this.steps;
        const message = clientConfirmationQuestion(
          messageDTO!.destination,
          `Nombre: ${client!.fullname}\n
          Dirección: ${client!.address}\n
          Cédula: ${client!.documentId}\n
          Telefono: ${messageDTO!.destination}`,
        );
        await this.setStep(ScriptStep.CONFIRM_CLIENT_DATA, messageDTO);
        const result = await services.send(message!);
        return result;
      }
      if ((currentStep as ScriptStep) === ScriptStep.CONFIRM_CLIENT_DATA) {
        if (response === ClientQuestionResponse.ACCEPT_DATA) {
          const [error, registerDTO] = ClientDTO.create({
            ...this.steps.client!,
            documentId: this.steps.client!.documentId?.toString(),
            phone: messageDTO!.destination,
          });
          if (error) {
            console.error(error);
            return null;
          }
          this.repository.create(registerDTO!);
        }
        return null;
      }
      return null;
    } else {
      this.resetSteps();
      const result = await this.sendMessage(ScriptStep.WELCOME, messageDTO);
      return result;
    }
  };
}
