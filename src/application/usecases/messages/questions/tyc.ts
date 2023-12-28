import builder from './builder';

export enum TyCQuestionResponse {
  ACCEPT_TYC = 'ACCEPT_TYC',
  REJECT_TYC = 'REJECT_TYC',
}

export const tycQuestion = (destination: string) =>
  builder.buildReplyButtonsMessage(
    destination,
    'Actualmente no te encuentras registrado con nosotros.\n\nAl realizar dicho registro aceptas que tus datos sean tratados de acuerdo con la política de privacidad de datos que puedes consultar en:\n\n 👉 https://bit.ly/\n\n¿Deseas realizar un registro corto para continuar el proceso?',
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

export const rejectTYCQuestion = (destination: string) =>
  builder.buildTextMessage(
    destination,
    'Lo sentimos, al rechazar nuestros términos y condiciones no podemos tomar tu pedido.\nTe esperamos nuevamente en una próxima oportunidad.',
    false,
  );
