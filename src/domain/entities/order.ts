export default interface OrderEntity {
  id?: string;
  restaurantId?: string;
  clientId?: string;
  type?: OrderType;
}

export enum OrderType {
  HOME_DELIVERY = 'HOME_DELIVERY',
  PICK_UP_AT_RESTAURANT = 'PICK_UP_AT_RESTAURANT',
}

export const REVIEW_THE_MENU = 'REVIEW_THE_MENU';
