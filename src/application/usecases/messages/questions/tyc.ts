import builder from './builder';

export enum TyCQuestionResponse {
  ACCEPT_TYC = 'ACCEPT_TYC',
  REJECT_TYC = 'REJECT_TYC',
}

export const tycQuestion = (destination: string) =>
  builder.buildReplyButtonsMessage(
    destination,
    'Tus datos serán tratados de acuerdo con la política de privacidad de datos que puedes consultar en:\n\n 👉 https://bit.ly/\n\n¿Estás de acuerdo?',
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
          id: TyCQuestionResponse.REJECT_TYC,
          title: 'Rechazar ❌',
        },
      },
    ],
  );
