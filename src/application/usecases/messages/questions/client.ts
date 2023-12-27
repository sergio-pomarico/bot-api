import builder from './builder';

export enum ClientQuestionResponse {
  ACCEPT_DATA = 'ACCEPT_DATA',
  REJECT_DATA = 'REJECT_DATA',
}

export const clientNameQuestion = (destination: string) => {
  return builder.buildTextMessage(destination, '¿Cuál es tu nombre?', false);
};

export const clientVerifyNationalIDQuestion = (destination: string) => {
  return builder.buildTextMessage(
    destination,
    'Detectamos que eres un usuario registrado, para continuar por favor ingresa los 4 ultimos digitos de tu número de cédula',
    false,
  );
};

export const clientAddressQuestion = (destination: string) => {
  return builder.buildTextMessage(destination, '¿Cuál es tu dirección?', false);
};

export const clientNationalIDQuestion = (destination: string) => {
  return builder.buildTextMessage(
    destination,
    '¿Cuál es tu número de cédula?',
    false,
  );
};

export const clientConfirmationQuestion = (
  destination: string,
  body: string,
) => {
  return builder.buildReplyButtonsMessage(destination, body, [
    {
      type: 'reply',
      reply: {
        id: ClientQuestionResponse.ACCEPT_DATA,
        title: 'Confirmar ✅',
      },
    },
    {
      type: 'reply',
      reply: {
        id: ClientQuestionResponse.REJECT_DATA,
        title: 'Rechazar ❌',
      },
    },
  ]);
};
