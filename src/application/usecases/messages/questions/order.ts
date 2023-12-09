import builder from './builder';

export enum OrderQuestionResponse {
  REVIEW_THE_MENU = 'REVIEW_THE_MENU',
  MAKE_A_ORDER = 'MAKE_A_ORDER',
}

export const makeOrderQuestion = (destination: string, name?: string) =>
  builder.buildReplyButtonsMessage(
    destination,
    `¡Hola ${
      name ? '' + name + '' : ''
    }! 😀 Soy el asistente virtual de LOS VERDES que te ayudará a gestionar tu pedido\n¿En qué puedo ayudarte?`,
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
    'Una vez hayas revisado nuestra carta te invitamos a realizar un pedido',
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
