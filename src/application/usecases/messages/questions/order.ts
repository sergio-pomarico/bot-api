import { WhatsAppMessageDTO } from '@domain/dtos';
import { OrderProductEntity } from '@domain/entities/order';
import {
  ProductAttributeRepository,
  ProductRepository,
} from '@domain/repositories';
import builder from './builder';

export enum OrderQuestionResponse {
  REVIEW_THE_MENU = 'REVIEW_THE_MENU',
  MAKE_A_ORDER = 'MAKE_A_ORDER',
}

export enum LastestOrdersQuestionResponse {
  CHECK_LASTES_ORDERS = 'CHECK_LASTES_ORDERS',
  MAKE_A_NEW_ORDER = 'MAKE_A_NEW_ORDER',
}

export enum AddProductToOrderQuestionResponse {
  ADD_PRODUCT = 'ADD_PRODUCT',
  GO_BACK_TO_MENU = 'GO_BACK_TO_MENU',
}

export enum FinishOrderQuestionResponse {
  FINISH = 'FINISH',
  ADD_MORE_PRODUCTS = 'ADD_MORE_PRODUCTS',
}

export enum ConfirmOrderResponse {
  CONFIRM_ORDER = 'CONFIRM_ORDER',
  ADD_MORE_PRODUCTS = 'ADD_MORE_PRODUCTS',
}

export const makeOrderQuestion = (destination: string, name?: string) =>
  builder.buildReplyButtonsMessage(
    destination,
    `¡Hola ${
      name ? '*' + name + '*' : ''
    }! 😀 Soy el asistente virtual de *LOS VERDES*\n\n¿En qué puedo ayudarte?`,
    [
      {
        type: 'reply',
        reply: {
          id: OrderQuestionResponse.MAKE_A_ORDER,
          title: 'Realizar pedido 🗣️',
        },
      },
      {
        type: 'reply',
        reply: {
          id: OrderQuestionResponse.REVIEW_THE_MENU,
          title: 'Revisar la carta 📃',
        },
      },
    ],
  );

export const makeOnlyOrderQuestion = (destination: string) =>
  builder.buildReplyButtonsMessage(
    destination,
    '*Carta Los Verdes*\n\nPuedes consultar nuestra carta en el siguiente enlace:\n\n 👉 https://bit.ly/losVerdes\n\nCuando estes listo te invitamos a *realizar un pedido 👇.*',
    [
      {
        type: 'reply',
        reply: {
          id: OrderQuestionResponse.MAKE_A_ORDER,
          title: 'Realizar pedido 🗣️',
        },
      },
    ],
  );

export const checkLastestOrdersQuestion = (
  destination: string,
  body: string,
) => {
  return builder.buildReplyButtonsMessage(destination, body, [
    {
      type: 'reply',
      reply: {
        id: LastestOrdersQuestionResponse.CHECK_LASTES_ORDERS,
        title: 'Repetir pedido 🔄',
      },
    },
    {
      type: 'reply',
      reply: {
        id: LastestOrdersQuestionResponse.MAKE_A_NEW_ORDER,
        title: 'Nuevo pedido 🗣️',
      },
    },
  ]);
};

export const addProductToOrderQuestion = (destination: string) =>
  builder.buildReplyButtonsMessage(
    destination,
    '¿Deseas agregar el producto a tu pedido?',
    [
      {
        type: 'reply',
        reply: {
          id: AddProductToOrderQuestionResponse.ADD_PRODUCT,
          title: 'Agregar al pedido 🛒',
        },
      },
      {
        type: 'reply',
        reply: {
          id: AddProductToOrderQuestionResponse.GO_BACK_TO_MENU,
          title: 'Volver a la carta 📃',
        },
      },
    ],
  );

export const finishOrderQuestion = (destination: string) =>
  builder.buildReplyButtonsMessage(
    destination,
    '¿Deseas finalizar tu pedido?',
    [
      {
        type: 'reply',
        reply: {
          id: FinishOrderQuestionResponse.FINISH,
          title: 'Finalizar Pedido 🛒',
        },
      },
      {
        type: 'reply',
        reply: {
          id: FinishOrderQuestionResponse.ADD_MORE_PRODUCTS,
          title: 'Seguir ordenando 📃',
        },
      },
    ],
  );

export const resumeOrderQuestion = async (
  messageDTO: WhatsAppMessageDTO,
  products: OrderProductEntity[],
  productAttributeRepository: ProductAttributeRepository,
  productRepository: ProductRepository,
) => {
  let message = 'Resumen del pedido\n\n';
  let total = 0;
  for (const data of products) {
    if (data.isAttribute) {
      const attribute = await productAttributeRepository.findById(
        data.productId,
      );
      const product = await productRepository.findById(attribute!.productId!);
      message += `*${product?.name}*  ${attribute?.title} x ${attribute?.price}\n`;
      total += attribute!.price!;
    } else {
      const product = await productRepository.findById(data.productId);
      message += `*${product?.name}* x ${product?.price}\n`;
      total += product!.price!;
    }
  }
  message += `Total: ${total}`;
  return builder.buildReplyButtonsMessage(messageDTO.destination, message, [
    {
      type: 'reply',
      reply: {
        id: ConfirmOrderResponse.CONFIRM_ORDER,
        title: 'confirmar pedido ✅',
      },
    },
    {
      type: 'reply',
      reply: {
        id: ConfirmOrderResponse.ADD_MORE_PRODUCTS,
        title: 'Seguir ordenando 📃',
      },
    },
  ]);
};
