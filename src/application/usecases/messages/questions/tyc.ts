import builder from './builder';

export enum TyCQuestionResponse {
  ACCEPT_TYC = 'ACCEPT_TYC',
  REJECT_TYC = 'ACCEPT_TYC',
}

export const tycQuestion = (destination: string) =>
  builder.buildReplyButtonsMessage(
    destination,
    'Acepta los términos y condiciones\n\n 👉 https://bit.ly/',
    [
      {
        type: 'reply',
        reply: {
          id: TyCQuestionResponse.ACCEPT_TYC,
          title: 'Aceptar ✅',
        },
      },
      {
        type: 'reply',
        reply: {
          id: TyCQuestionResponse.ACCEPT_TYC,
          title: 'Rechazar ❌',
        },
      },
    ],
  );
