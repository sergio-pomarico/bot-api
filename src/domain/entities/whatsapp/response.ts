export interface WhatsAppResponse {
  object: string;
  entry: Entry[];
}

interface Entry {
  id: string;
  changes: Change[];
}

interface Change {
  value: Value;
  field: string;
}

interface Value {
  messaging_product: string;
  metadata: MessageMetadata;
  contacts: Contact[];
  messages: MessageReceived[];
}

interface MessageMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

interface Contact {
  profile: Profile;
  wa_id: string;
}

interface Profile {
  name: string;
}

export type MessageType = 'text' | 'interactive';

interface MessageReceived {
  from: string;
  id: string;
  timestamp: string;
  type: MessageType;
  text?: TextMessage;
  interactive: InteractiveMessage;
}

interface InteractiveButtonReply {
  id: string;
  title: string;
}

type InteractiveTypeMessage = 'button_reply' | 'list_reply';

interface InteractiveMessage {
  type: InteractiveTypeMessage;
  button_reply?: InteractiveButtonReply;
  list_reply?: InteractiveButtonReply;
}

interface TextMessage {
  body: string;
}
