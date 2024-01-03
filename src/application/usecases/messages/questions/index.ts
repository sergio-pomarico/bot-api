import {
  OrderQuestionResponse,
  makeOrderQuestion,
  makeOnlyOrderQuestion,
} from './order';
import { TyCQuestionResponse, tycQuestion, rejectTYCQuestion } from './tyc';
import {
  clientNameQuestion,
  clientAddressQuestion,
  clientNationalIDQuestion,
  clientConfirmationQuestion,
  clientVerifyNationalIDQuestion,
} from './client';
import { categoriesQuestion } from './products';

export {
  makeOrderQuestion,
  makeOnlyOrderQuestion,
  OrderQuestionResponse,
  TyCQuestionResponse,
  tycQuestion,
  rejectTYCQuestion,
  clientNameQuestion,
  clientAddressQuestion,
  clientNationalIDQuestion,
  clientConfirmationQuestion,
  clientVerifyNationalIDQuestion,
  categoriesQuestion,
};
