import builder from './builder';

export const categoriesQuestion = (destination: string, text: string) => {
  return builder.buildTextMessage(destination, text, false);
};
