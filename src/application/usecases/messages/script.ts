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
        message = this.builder.buidInteractiveListMessage(
          destination,
          'Sedes',
          'Indica a que sede quieres realizar el pedido',
          [
            {
              title: 'Sedes',
              rows: [
                {
                  id: '1',
                  title: 'Pilarica',
                },
                {
                  id: '2',
                  title: 'San Nicolas',
                },
                {
                  id: '3',
                  title: 'Guayabal',
                },
                {
                  id: '4',
                  title: 'Bello horizonte',
                },
              ],
            },
          ],
        );
        break;
      default:
        break;
    }
    return message!;
  };
}
