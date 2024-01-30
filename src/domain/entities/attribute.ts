export interface ProductAttributeEntity {
  id: string;
  title: string;
  description?: string;
  price?: number;
  productId?: string;
  size?: Size;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Size {
  Small = 'small',
  Personal = 'personal',
  Medium = 'medium',
  large = 'large',
}
