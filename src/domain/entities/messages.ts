export interface WhatsAppMessageResponse {
  object: string;
  entry: Entry[];
}

export interface Entry {
  id: string;
  changes: Change[];
}

export interface Change {
  value: Value;
  field: string;
}

export interface Value {
  messaging_product: string;
  metadata: MessageMetadata;
  contacts: Contact[];
  messages: Message[];
}

export interface MessageMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Contact {
  profile: Profile;
  wa_id: string;
}

export interface Profile {
  name: string;
}

export interface Message {
  from: string;
  id: string;
  timestamp: string;
  text: Text;
  type: string;
}

export interface Text {
  body: string;
}
