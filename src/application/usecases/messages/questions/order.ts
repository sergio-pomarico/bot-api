import { WhatsAppMessageDTO } from '@domain/dtos';
import { OrderEntity, OrderType, PaymentMethod } from '@domain/entities';
import {
  ProductAttributeRepository,
  ProductRepository,
} from '@domain/repositories';
import builder from './builder';
import { RestaurantEntity } from '@domain/entities';
import { Item } from '../cache';

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

export const latestOrderResumeQuestion = async (
  order: OrderEntity,
  productAttributeRepository: ProductAttributeRepository,
  messageDTO: WhatsAppMessageDTO,
) => {
  let message = `Tu último pedido en el punto de venta ${order.restaurant?.name} (${order.restaurant?.address}) fue:\n\n`;
  let total = 0;
  for (const item of order.items!) {
    if (item.attributeId) {
      const attribute = await productAttributeRepository.findById(
        item.attributeId,
      );
      message += `*${item.product?.name}* ${attribute?.title} x  ${item.price}\n`;
    } else {
      message += `*${item.product?.name}* x ${item.price}\n`;
    }
    total += item.price!;
  }
  message += `Total: ${total}`;
  return builder.buildReplyButtonsMessage(messageDTO.destination, message, [
    {
      type: 'reply',
      reply: {
        id: ConfirmOrderResponse.CONFIRM_ORDER,
        title: 'Confirmar pedido ✅',
      },
    },
    {
      type: 'reply',
      reply: {
        id: ConfirmOrderResponse.ADD_MORE_PRODUCTS,
        title: 'Nuevo pedido 🗣️',
      },
    },
  ]);
};

export const resumeOrderQuestion = async (
  messageDTO: WhatsAppMessageDTO,
  products: Item[],
  productAttributeRepository: ProductAttributeRepository,
  productRepository: ProductRepository,
) => {
  let message = 'Resumen del pedido\n\n';
  let total = 0;
  for (const data of products) {
    if (data.attributeId) {
      const attribute = await productAttributeRepository.findById(
        data.attributeId,
      );
      message += `*${attribute?.product?.name}*  ${attribute?.title} x ${attribute?.price}\n`;
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
        title: 'Confirmar pedido ✅',
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

export const selectOrderTypeQuestion = (destination: string) => {
  return builder.buildReplyButtonsMessage(
    destination,
    '¿Cómo deseas recibir tu pedido?',
    [
      {
        type: 'reply',
        reply: {
          id: OrderType.HOME_DELIVERY,
          title: 'Domicilio 🏠',
        },
      },
      {
        type: 'reply',
        reply: {
          id: OrderType.PICK_UP_AT_RESTAURANT,
          title: 'Recoger en sitio 🏢',
        },
      },
    ],
  );
};

export const selectPaymentMethodQuestion = (destination: string) => {
  return builder.buildReplyButtonsMessage(
    destination,
    '¿Cómo deseas pagar tu pedido?',
    [
      {
        type: 'reply',
        reply: {
          id: PaymentMethod.CASH,
          title: 'En efectivo 💵',
        },
      },
      {
        type: 'reply',
        reply: {
          id: PaymentMethod.BANK_TRANSFER,
          title: 'Por transferencia 💳',
        },
      },
    ],
  );
};

export const placeQuestion = (
  destination: string,
  restaurants: RestaurantEntity[],
) => {
  return builder.buidInteractiveListMessage(
    destination,
    'Elegir restaurante',
    'Elige el restaurante donde deseas recoger tu pedido',
    restaurants.map((restaurant) => {
      return {
        title: restaurant.name,
        rows: [
          {
            id: restaurant.id!,
            title: restaurant.address,
          },
        ],
      };
    }),
  );
};

export const finishProcessQuestion = (destination: string) => {
  return builder.buildTextMessage(
    destination,
    '¡Gracias por tu pedido! 🥳\n\nEn breve te contactaremos para confirmar tu pedido.',
    false,
  );
};
