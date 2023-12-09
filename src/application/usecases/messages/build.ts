import {
  InteractiveMessage,
  LocationMessage,
  DocumentMessage,
  TextMessage,
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

export interface MessageBuilderHelper {
  buildTextMessage: (
    to: string,
    text: string,
    preview_url: boolean,
  ) => TextMessage;
  buildDocMessage: (
    to: string,
    doc: string,
    caption?: string,
    filename?: string,
  ) => DocumentMessage;
  buildLocationMessage: (
    to: string,
    latitude: number,
    longitude: number,
    name: string,
    address: string,
  ) => LocationMessage;
  buildReplyButtonsMessage: (
    to: string,
    bodyText: string,
    buttons: Button[],
    header?: string,
    footer?: string,
  ) => InteractiveMessage;
  buidInteractiveListMessage: (
    to: string,
    buttonName: string,
    bodyText: string,
    sections: Section[],
    header?: string,
    footer?: string,
  ) => InteractiveMessage;
}

export class MessageBuilder implements MessageBuilderHelper {
  buidInteractiveListMessage = (
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

  buildTextMessage = (
    to: string,
    text: string,
    preview_url: boolean,
  ): TextMessage => ({
    ...payloadBase,
    to,
    type: 'text',
    text: {
      body: text,
      preview_url,
    },
  });
  buildDocMessage = (
    to: string,
    doc: string,
    caption?: string,
    filename?: string,
  ): DocumentMessage => ({
    ...payloadBase,
    to,
    type: 'document',
    document: {
      link: doc,
      caption,
      filename,
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

  buildReplyButtonsMessage = (
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
