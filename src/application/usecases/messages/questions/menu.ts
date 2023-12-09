import builder from './builder';

const menuQuestion = (destination: string) =>
  builder.buildDocMessage(
    destination,
    'https://pub-ca776725988b4cb498ebec960781652a.r2.dev/menu_los_verdes.pdf',
    'menu_los_verdes.pdf',
    'Menu Los Verdes',
  );

export default menuQuestion;
