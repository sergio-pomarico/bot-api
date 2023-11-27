import { OrderType, REVIEW_THE_MENU, WhatsAppMessage } from '@domain/entities';
import { MessageBuilder, MessageBuilderHelper } from './build';

export class ConversationScript {
  constructor(
    private readonly builder: MessageBuilderHelper = new MessageBuilder(),
  ) {}
  question = (
    step: number,
    destination: string,
    name?: string,
  ): WhatsAppMessage => {
    let message: WhatsAppMessage;
    switch (step) {
      case 0:
        message = this.builder.buidInteractiveListMessage(
          destination,
          'Opciones',
          `¡Hola${
            name ? '' + name + '' : ''
          }! 😀 Soy el asistente virtual de LOS VERDES que te ayudará a gestionar tu pedido\n¿En qué puedo ayudarte?`,
          [
            {
              title: 'Opciones',
              rows: [
                {
                  id: OrderType.HOME_DELIVERY,
                  title: 'Pedir domicilio 🛵',
                },
                {
                  id: OrderType.PICK_UP_AT_RESTAURANT,
                  title: 'Recoger pedido 🛒',
                },
                {
                  id: REVIEW_THE_MENU,
                  title: 'Revisar la carta 📃',
                },
              ],
            },
          ],
        );
        break;
      case 1:
        message = this.builder.buildTextMessage(
          destination,
          'Para validar si estás registrado por favor ingresa tu número de identificación, sin símbolos o puntos. Ej: 12345678',
          false,
        );
        break;
      default:
        break;
    }
    return message!;
  };
}
