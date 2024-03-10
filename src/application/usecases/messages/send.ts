import { differenceInDays } from 'date-fns';
import {
  ClientDTO,
  OrderDTO,
  OrderItemDTO,
  WhatsAppMessageDTO,
} from '@domain/dtos';
import {
  WhatsAppMessageResult,
  OrderType,
  PaymentMethod,
  OrderItemEntity,
} from '@domain/entities';
import services from '@infrastructure/services/api';
import { ConversationScript, ScriptStep } from './script';
import { MessageResponse } from './response';
import {
  ClientRepository,
  CategoryRepository,
  ProductRepository,
  ProductAttributeRepository,
  RestaurantRepository,
  OrderRepository,
  OrderItemRepository,
} from '@domain/repositories';
import {
  OrderQuestionResponse,
  TyCQuestionResponse,
  categoriesQuestion,
  checkLastestOrdersQuestion,
  clientConfirmationQuestion,
  AddProductToOrderQuestionResponse,
  productsQuestion,
  attributesQuestion,
  resumeOrderQuestion,
  LastestOrdersQuestionResponse,
  FinishOrderQuestionResponse,
  ClientQuestionResponse,
  ConfirmOrderResponse,
  placeQuestion,
  finishProcessQuestion,
  latestOrderResumeQuestion,
} from './questions';
import { CacheDialog, ConversationStep, Item } from './cache';

export interface SendMessageUseCase {
  run: (
    messageDTO: WhatsAppMessageDTO,
  ) => Promise<WhatsAppMessageResult | null>;
}

export class SendMessage extends CacheDialog implements SendMessageUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    private readonly restaurantRepository: RestaurantRepository,
    private readonly productAttributeRepository: ProductAttributeRepository,
    private readonly orderRepository: OrderRepository,
    private readonly itemRepository: OrderItemRepository,
    private readonly responses = new MessageResponse(),
    private readonly script = new ConversationScript(),
  ) {
    super();
  }

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

      if (currentStep === ScriptStep.WELCOME) {
        if (response === OrderQuestionResponse.REVIEW_THE_MENU) {
          const result = await this.sendMessage(ScriptStep.MENU, messageDTO);
          return result;
        } else if (response === OrderQuestionResponse.MAKE_A_ORDER) {
          const client = await this.clientRepository.find(
            messageDTO!.destination,
          );
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
              const message = await categoriesQuestion(
                messageDTO,
                this.categoryRepository,
              );
              const result = await services.send(message!);
              await this.setStep(ScriptStep.CATEGORY, messageDTO);
              return result;
            }
          }
        } else {
          return null;
        }
      }
      if (currentStep === ScriptStep.MENU) {
        if (response === OrderQuestionResponse.MAKE_A_ORDER) {
          const client = await this.clientRepository.find(
            messageDTO!.destination,
          );
          if (client === null) {
            const result = await this.sendMessage(ScriptStep.TYC, messageDTO);
            return result;
          } else {
            if (differenceInDays(new Date(), client.updatedAt!) >= 90) {
              const result = await this.sendMessage(
                ScriptStep.CLIENT_VERFIFY_NATIONAL_ID,
                messageDTO,
              );
              return result;
            } else {
              //TODO: check last orders
              const message = checkLastestOrdersQuestion(
                messageDTO!.destination,
                `Hola ${client?.fullname} nos encanta que estes de vuelta\n\n¿Deseas ordenar lo mismo que la última vez?`,
              );
              await this.setStep(ScriptStep.CHECK_LASTES_ORDERS, messageDTO);
              const result = await services.send(message!);
              return result;
            }
          }
        }
        return null;
      }
      if (currentStep === ScriptStep.CLIENT_VERFIFY_NATIONAL_ID) {
        const client = await this.clientRepository.find(
          messageDTO!.destination,
        );
        const { documentId } = client!;
        if (response === documentId?.toString().slice(-4)) {
          const message = checkLastestOrdersQuestion(
            messageDTO!.destination,
            `Hola ${client?.fullname} nos encanta que estes de vuelta\n\n¿Deseas ordenar lo mismo que la última vez?`,
          );
          await this.setStep(ScriptStep.CHECK_LASTES_ORDERS, messageDTO);
          const result = await services.send(message!);
          return result;
        } else {
          //TODO: reject client
        }
      }
      if (currentStep === ScriptStep.CHECK_LASTES_ORDERS) {
        if (response === LastestOrdersQuestionResponse.MAKE_A_NEW_ORDER) {
          const message = await categoriesQuestion(
            messageDTO,
            this.categoryRepository,
          );
          await this.setStep(ScriptStep.CATEGORY, messageDTO);
          const result = await services.send(message!);
          return result;
        } else if (
          response === LastestOrdersQuestionResponse.CHECK_LASTES_ORDERS
        ) {
          const client = await this.clientRepository.find(
            messageDTO!.destination,
          );
          if (client!.orders !== null && client!.orders!.length > 0) {
            const { orders } = client!;
            const order = orders!.reduce((a, b) =>
              new Date(a!.createdAt!) > new Date(b!.createdAt!) ? a : b,
            );
            const message = await latestOrderResumeQuestion(
              order!,
              this.productAttributeRepository,
              messageDTO,
            );
            const result = await services.send(message!);
            return result;
          } else {
            //send new order
          }
        }
      }
      if (currentStep === ScriptStep.TYC) {
        if (response === TyCQuestionResponse.ACCEPT_TYC) {
          const result = await this.sendMessage(
            ScriptStep.CLIENT_NAME,
            messageDTO,
          );
          return result;
        } else {
          const result = await this.sendMessage(
            ScriptStep.REJECT_TYC,
            messageDTO,
          );
          return result;
        }
      }
      if (currentStep === ScriptStep.REJECT_TYC) {
        return null;
      }
      if (currentStep === ScriptStep.CLIENT_NAME) {
        await this.updateClient('fullname', response, messageDTO);
        const result = await this.sendMessage(
          ScriptStep.CLIENT_ADDRESS,
          messageDTO,
        );
        return result;
      }
      if (currentStep === ScriptStep.CLIENT_ADDRESS) {
        await this.updateClient('address', response, messageDTO);
        const result = await this.sendMessage(
          ScriptStep.CLIENT_NATIONAL_ID,
          messageDTO,
        );
        return result;
      }
      if (currentStep === ScriptStep.CLIENT_NATIONAL_ID) {
        await this.updateClient('documentId', response, messageDTO);
        const { client } = this.steps;
        let textMessage = 'Por favor confirma tus datos\n\n';
        textMessage += `Nombre: *${client!.fullname}*\n`;
        textMessage += `Dirección: *${client!.address}*\n`;
        textMessage += `Cédula: *${client!.documentId}*\n`;
        textMessage += `Telefono: *${messageDTO!.destination}*`;
        const message = clientConfirmationQuestion(
          messageDTO!.destination,
          textMessage,
        );
        await this.setStep(ScriptStep.CONFIRM_CLIENT_DATA, messageDTO);
        const result = await services.send(message!);
        return result;
      }
      if (currentStep === ScriptStep.CONFIRM_CLIENT_DATA) {
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
          this.clientRepository.create(registerDTO!);
          const message = await categoriesQuestion(
            messageDTO,
            this.categoryRepository,
          );
          const result = await services.send(message!);
          await this.setStep(ScriptStep.CATEGORY, messageDTO);
          return result;
        } else if (response === ClientQuestionResponse.REJECT_DATA) {
          const result = await this.sendMessage(
            ScriptStep.CLIENT_NAME,
            messageDTO,
          );
          return result;
        }
        return null;
      }
      if (currentStep === ScriptStep.CATEGORY) {
        if (response.length !== 1) {
          return null;
        }
        const index = response.charCodeAt(0) - 64;
        const categories = await this.categoryRepository.all();
        const client = await this.clientRepository.find(
          messageDTO!.destination,
        );
        const category = categories![index - 1];
        if (index > categories!.length) {
          return null;
        }
        await this.setCategory(category.id!, messageDTO);
        await this.updateOrder('clientId', client!.id!, messageDTO);
        const message = await productsQuestion(
          messageDTO,
          index,
          categories!,
          this.productRepository,
        );
        const result = await services.send(message!);
        await this.setStep(ScriptStep.PRODUCT, messageDTO);
        return result;
      }
      if (currentStep === ScriptStep.PRODUCT) {
        if (response.length !== 1) {
          return null;
        }
        const categoryId = this.steps.currentCategory;
        const products = await this.productRepository.findByCategoryId(
          categoryId!,
        );
        const index = response.charCodeAt(0) - 64;
        const product = products![index - 1];
        if (product.attributes !== null && product.attributes!.length > 0) {
          await this.setProduct(product.id!, messageDTO, true);
          const message = await attributesQuestion(
            messageDTO,
            product.attributes!,
          );
          const result = await services.send(message!);
          await this.setStep(ScriptStep.ATTRIBUTE, messageDTO);
          return result;
        } else {
          await this.setProduct(product.id!, messageDTO);
          const result = await this.sendMessage(
            ScriptStep.ADD_PRODUCT,
            messageDTO,
          );
          return result;
        }
      }
      if (currentStep === ScriptStep.ATTRIBUTE) {
        if (response.length !== 1) {
          return null;
        }
        const result = await this.sendMessage(
          ScriptStep.ADD_PRODUCT,
          messageDTO,
        );
        return result;
      }
      if (currentStep === ScriptStep.ADD_PRODUCT) {
        if (response === AddProductToOrderQuestionResponse.ADD_PRODUCT) {
          const currentProduct = this.steps.currentProduct;
          if (currentProduct!.isAttribute ?? false) {
            const productId = currentProduct!.productId;
            const attributes =
              await this.productAttributeRepository.findAttributesByProductId(
                productId,
              );
            const index = response.charCodeAt(0) - 64;
            const attribute = attributes![index - 1];
            this.updateOrder(
              'items',
              [
                ...(this.steps.order?.items ?? []),
                {
                  quantity: 1,
                  productId: currentProduct!.productId!,
                  attributeId: attribute.id!,
                  price: attribute.price!,
                },
              ],
              messageDTO,
            );
          } else {
            const product = await this.productRepository.findById(
              currentProduct!.productId!,
            );
            this.updateOrder(
              'items',
              [
                ...(this.steps.order?.items ?? []),
                {
                  quantity: 1,
                  productId: product!.id!,
                  price: product!.price!,
                },
              ],
              messageDTO,
            );
          }
          const result = await this.sendMessage(
            ScriptStep.FINISH_ORDER,
            messageDTO,
          );
          return result;
        } else if (
          response === AddProductToOrderQuestionResponse.GO_BACK_TO_MENU
        ) {
          const message = await categoriesQuestion(
            messageDTO,
            this.categoryRepository,
          );
          const result = await services.send(message!);
          await this.setStep(ScriptStep.CATEGORY, messageDTO);
          return result;
        }
      }
      if (currentStep === ScriptStep.FINISH_ORDER) {
        if (response == FinishOrderQuestionResponse.FINISH) {
          const message = await resumeOrderQuestion(
            messageDTO,
            this.steps.order!.items!,
            this.productAttributeRepository,
            this.productRepository,
          );
          const result = await services.send(message!);
          await this.setStep(ScriptStep.CONFIRM_ORDER, messageDTO);
          return result;
        } else if (response == FinishOrderQuestionResponse.ADD_MORE_PRODUCTS) {
          const message = await categoriesQuestion(
            messageDTO,
            this.categoryRepository,
          );
          const result = await services.send(message!);
          await this.setStep(ScriptStep.CATEGORY, messageDTO);
          return result;
        }
      }
      if (currentStep === ScriptStep.CONFIRM_ORDER) {
        if (response === ConfirmOrderResponse.CONFIRM_ORDER) {
          const result = await this.sendMessage(
            ScriptStep.ORDER_TYPE,
            messageDTO,
          );
          return result;
        } else if (ConfirmOrderResponse.ADD_MORE_PRODUCTS) {
          const message = await categoriesQuestion(
            messageDTO,
            this.categoryRepository,
          );
          const result = await services.send(message!);
          await this.setStep(ScriptStep.CATEGORY, messageDTO);
          return result;
        }
      }
      if (currentStep === ScriptStep.ORDER_TYPE) {
        if (response === OrderType.HOME_DELIVERY) {
          const result = await this.sendMessage(
            ScriptStep.PAYMENT_METHOD,
            messageDTO,
          );
          await this.updateOrder('type', OrderType.HOME_DELIVERY, messageDTO);
          return result;
        } else if (response === OrderType.PICK_UP_AT_RESTAURANT) {
          const restaurants = await this.restaurantRepository.all();
          await this.updateOrder(
            'type',
            OrderType.PICK_UP_AT_RESTAURANT,
            messageDTO,
          );
          const message = placeQuestion(
            messageDTO.destination,
            restaurants ?? [],
          );
          const result = await services.send(message);
          await this.setStep(ScriptStep.PLACE, messageDTO);
          return result;
        }
      }
      if (currentStep === ScriptStep.PAYMENT_METHOD) {
        this.updateOrder('paymentMethod', response, messageDTO);
        const restaurants = await this.restaurantRepository.all();
        const message = placeQuestion(
          messageDTO.destination,
          restaurants ?? [],
        );
        const result = await services.send(message);
        await this.setStep(ScriptStep.PLACE, messageDTO);
        return result;
      }
      if (currentStep === ScriptStep.PLACE) {
        this.updateOrder('restaurantId', response, messageDTO);
        const client = await this.clientRepository.find(messageDTO.destination);
        const [error, orderDTO] = OrderDTO.create({
          type: this.steps.order!.type! as OrderType,
          clientId: client?.id as string,
          restaurantId: this.steps.order!.restaurantId! as string,
          paymentMethod: this.steps.order!.paymentMethod! as PaymentMethod,
        });
        if (error) return null;

        const order = await this.orderRepository.create(orderDTO!);

        const items: OrderItemEntity[] = [];

        this.steps.order!.items!.map(async (i: Item) => {
          const [error, itemDTO] = OrderItemDTO.create({
            orderId: order!.id!,
            productId: i.productId,
            price: i.price,
            quantity: i.quantity,
            attributeId: i.attributeId,
          });
          if (error) return null;
          const item = await this.itemRepository.create(itemDTO!);
          items.push(item!);
        });

        order!.items = items;
        this.orderRepository.update(order!.id!, order!);
        //TODO: update client.updateAt
        const message = finishProcessQuestion(messageDTO.destination);
        const result = await services.send(message!);
        await this.resetSteps(messageDTO);
        return result;
      }
      return null;
    } else {
      await this.resetSteps(messageDTO);
      const result = await this.sendMessage(ScriptStep.WELCOME, messageDTO);
      return result;
    }
  };
}
