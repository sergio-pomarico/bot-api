import { ClientEntity, OrderType, PaymentMethod } from '@domain/entities';
import { ScriptStep } from './script';
import { WhatsAppMessageDTO } from '@domain/dtos';
import { CacheManager } from '@infrastructure/services/cache';

export interface Item {
  quantity: number;
  productId: string;
  attributeId?: string;
  price: number;
}

export interface Order {
  restaurantId?: string;
  clientId?: string;
  type?: OrderType;
  items?: Item[];
  paymentMethod?: PaymentMethod;
}

export interface ConversationStep {
  step: ScriptStep;
  currentCategory?: string;
  client: ClientEntity | undefined;
  order: Order | undefined;
  currentProduct?: { productId: string; isAttribute: boolean } | undefined;
}

const inistialAnswers: ConversationStep = {
  step: ScriptStep.INITIAL,
  client: undefined,
  order: undefined,
  currentCategory: undefined,
  currentProduct: undefined,
};

export class CacheDialog {
  constructor(public readonly cache: CacheManager = new CacheManager()) {}
  public steps: ConversationStep = inistialAnswers;

  setStep = async (step: ScriptStep, messageDTO: WhatsAppMessageDTO) => {
    this.steps.step = step;
    await this.cache.set(messageDTO!.destination, this.steps);
  };

  setCategory = async (category: string, messageDTO: WhatsAppMessageDTO) => {
    this.steps.currentCategory = category;
    await this.cache.set(messageDTO!.destination, this.steps);
  };

  setProduct = async (
    product: string,
    messageDTO: WhatsAppMessageDTO,
    isAttribute = false,
  ) => {
    this.steps.currentProduct = { productId: product, isAttribute };
    await this.cache.set(messageDTO!.destination, this.steps);
  };

  resetSteps = async (messageDTO: WhatsAppMessageDTO) => {
    this.steps = inistialAnswers;
    await this.cache.set(messageDTO!.destination, this.steps);
  };

  updateOrder = async (
    key: string,
    value: string | number | Item[],
    messageDTO: WhatsAppMessageDTO,
  ) => {
    this.steps.order = { ...this.steps.order, ...{ [key]: value } };
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
}
