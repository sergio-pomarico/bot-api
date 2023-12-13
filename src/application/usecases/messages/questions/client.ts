import builder from './builder';

export const clientNameQuestion = (destination: string) => {
  return builder.buildTextMessage(destination, '¿Cuál es tu nombre?', false);
};

export const clientAddressQuestion = (destination: string) => {
  return builder.buildTextMessage(destination, '¿Cuál es tu dirección?', false);
};

export const clientNationalIDQuestion = (destination: string) => {
  return builder.buildTextMessage(
    destination,
    '¿Cuál es tu número de cédula?',
    false,
  );
};
