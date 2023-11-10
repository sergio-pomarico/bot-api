import {
  InteractiveMessage,
  LocationMessage,
  WhatsAppTextMessage,
} from '@domain/entities/whatsapp';

interface PaylodBase {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
}

const payloadBase: PaylodBase = {
  messaging_product: 'whatsapp',
  recipient_type: 'individual',
};

interface Row {
  id: string | number;
  title: string | number;
  description?: string;
}

interface Button {
  type: 'reply';
  reply: {
    id: string;
    title: string;
  };
}

interface Section {
  title: string;
  rows: Row[];
}

export class MessageBuilder {
  static buidInteractiveListMessage = (
    to: string,
    buttonName: string,
    bodyText: string,
    sections: Section[],
    header?: string,
    footer?: string,
  ): InteractiveMessage => ({
    ...payloadBase,
    to: to,
    type: 'interactive',
    interactive: {
      type: 'list',
      ...(header ? { header: { type: 'text', text: header } } : {}),
      body: {
        text: bodyText,
      },
      ...(footer
        ? {
            footer: { text: footer },
          }
        : {}),
      action: {
        button: buttonName,
        sections,
      },
    },
  });

  static buildTextMessage = (
    to: string,
    text: string,
    preview_url: boolean,
  ): WhatsAppTextMessage => ({
    ...payloadBase,
    to,
    type: 'text',
    text: {
      body: text,
      preview_url,
    },
  });
  buildLocationMessage = (
    to: string,
    latitude: number,
    longitude: number,
    name: string,
    address: string,
  ): LocationMessage => ({
    ...payloadBase,
    to,
    type: 'location',
    location: {
      latitude,
      longitude,
      name: name,
      address: address,
    },
  });

  static buildReplyButtonsMessage = (
    to: string,
    bodyText: string,
    buttons: Button[],
    header?: string,
    footer?: string,
  ): InteractiveMessage => ({
    ...payloadBase,
    to,
    type: 'interactive',
    interactive: {
      ...(header ? { header: { type: 'text', text: header } } : {}),
      body: {
        text: bodyText,
      },
      ...(footer
        ? {
            footer: { text: footer },
          }
        : {}),
      type: 'button',
      action: {
        buttons: buttons,
      },
    },
  });
}
