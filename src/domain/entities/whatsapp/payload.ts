export interface WhatsAppMessageResult {
  messaging_product: string;
  contacts: [
    {
      input: string;
      wa_id: string;
    },
  ];
  messages: [
    {
      id: string;
    },
  ];
}

export interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
}

interface Location {
  longitude: number;
  latitude: number;
  name?: string;
  address?: string;
}

interface MediaWithId {
  id: string;
}

interface MediaWithLink {
  link: string;
}

interface MediaBase {
  caption?: string;
  filename?: string;
}

export interface Text {
  body: string;
  preview_url?: boolean;
}

export type Media = MediaBase & (MediaWithId | MediaWithLink);

interface InteractiveHeaderVideo {
  type: 'video';
  video: Media;
}

interface InteractiveHeaderImage {
  type: 'image';
  image: Media;
}

interface InteractiveHeaderDocument {
  type: 'document';
  document: Media;
}

interface InteractiveHeaderText {
  type: 'text';
  text: string;
}

export type InteractiveHeader =
  | InteractiveHeaderText
  | InteractiveHeaderVideo
  | InteractiveHeaderImage
  | InteractiveHeaderDocument;

export interface InteractiveBase {
  body: {
    text: string;
  };
  footer?: {
    text: string;
  };
  header?: InteractiveHeader;
}

export interface InteractiveReplyButton {
  type: 'button';
  action: {
    buttons: {
      type: 'reply';
      reply: {
        title: string | number;
        id: string;
      };
    }[];
  };
}

export interface InteractiveListMessage {
  type: 'list';
  action: {
    button: string;
    sections: {
      title: string;
      rows: {
        id: string | number;
        title: string | number;
        description?: string;
      }[];
    }[];
  };
}

type Interactive = InteractiveBase &
  (InteractiveReplyButton | InteractiveListMessage);

export interface InteractiveMessage extends WhatsAppMessage {
  type: 'interactive';
  interactive: Interactive;
}

export interface DocumentMessage extends WhatsAppMessage {
  type: 'document';
  document: Media;
}

export interface ImageMessage extends WhatsAppMessage {
  type: 'image';
  image: Media;
}

export interface LocationMessage extends WhatsAppMessage {
  type: 'location';
  location: Location;
}

export interface WhatsAppTextMessage extends WhatsAppMessage {
  type: 'text';
  text: Text;
}
