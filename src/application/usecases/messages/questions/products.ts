import { WhatsAppMessageDTO } from '@domain/dtos';
import { CategoryRepository, ProductRepository } from '@domain/repositories';
import builder from './builder';
import { CategoryEntity, ProductAttributeEntity } from '@domain/entities';

export const categoriesQuestion = async (
  messageDTO: WhatsAppMessageDTO,
  respository: CategoryRepository,
) => {
  const categories = await respository.all();
  let categoriesMessage =
    'Por favor selecciona una categoría\n(Escriba la letra)\n\n';
  categories?.map((category, index) => {
    categoriesMessage += `${String.fromCharCode(65 + index)}) *${
      category.title
    }*\n`;
  });
  return builder.buildTextMessage(
    messageDTO.destination,
    categoriesMessage,
    false,
  );
};

export const productsQuestion = async (
  messageDTO: WhatsAppMessageDTO,
  categoryIndex: number,
  categories: CategoryEntity[],
  productRepository: ProductRepository,
) => {
  const category = categories![categoryIndex - 1];
  const products = await productRepository.findByCategoryId(category.id!);
  let productMessage =
    'Por favor selecciona un producto\n(Escriba la letra)\n\n';
  products?.map((product, index) => {
    productMessage += `${String.fromCharCode(65 + index)}) *${product.name}*\n`;
  });
  return builder.buildTextMessage(
    messageDTO.destination,
    productMessage,
    false,
  );
};

export const attributesQuestion = async (
  messageDTO: WhatsAppMessageDTO,
  attributes: ProductAttributeEntity[],
) => {
  let attributesMessage =
    'Por favor selecciona un tamaño\n(Escriba la letra)\n\n';
  attributes?.map((attribute, index) => {
    attributesMessage += `${String.fromCharCode(65 + index)}) *${
      attribute.title
    }*\n`;
  });
  return builder.buildTextMessage(
    messageDTO.destination,
    attributesMessage,
    false,
  );
};
