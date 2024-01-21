import { WhatsAppMessage } from '@domain/entities';
import {
  makeOrderQuestion,
  makeOnlyOrderQuestion,
  tycQuestion,
  rejectTYCQuestion,
  clientNameQuestion,
  clientAddressQuestion,
  clientNationalIDQuestion,
  clientVerifyNationalIDQuestion,
} from './questions';

export enum ScriptStep {
  INITIAL = 'INITIAL',
  WELCOME = 'WELCOME',
  MENU = 'MENU',
  TYC = 'TYC',
  REJECT_TYC = 'REJECT_TYC',
  CLIENT_NAME = 'CLIENT_NAME',
  CLIENT_ADDRESS = 'CLIENT_ADDRESS',
  CLIENT_NATIONAL_ID = 'CLIENT_NATIONAL_ID',
  CLIENT_VERFIFY_NATIONAL_ID = 'CLIENT_VERFIFY_NATIONAL_ID',
  CONFIRM_CLIENT_DATA = 'CONFIRM_CLIENT_DATA',
  CATEGORY = 'CATEGORY',
}

export class ConversationScript {
  question = (
    step: ScriptStep,
    destination: string,
    name?: string,
  ): WhatsAppMessage => {
    let message: WhatsAppMessage;
    switch (step) {
      case ScriptStep.WELCOME:
        message = makeOrderQuestion(destination, name);
        break;
      case ScriptStep.MENU:
        message = makeOnlyOrderQuestion(destination);
        break;
      case ScriptStep.TYC:
        message = tycQuestion(destination);
        break;
      case ScriptStep.REJECT_TYC:
        message = rejectTYCQuestion(destination);
        break;
      case ScriptStep.CLIENT_NAME:
        message = clientNameQuestion(destination);
        break;
      case ScriptStep.CLIENT_ADDRESS:
        message = clientAddressQuestion(destination);
        break;
      case ScriptStep.CLIENT_NATIONAL_ID:
        message = clientNationalIDQuestion(destination);
        break;
      case ScriptStep.CLIENT_VERFIFY_NATIONAL_ID:
        message = clientVerifyNationalIDQuestion(destination);
        break;
      default:
        break;
    }
    return message!;
  };
}
