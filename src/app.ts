import { Server } from './infrastructure/server';
import { env } from './utils';
import { postgreSQLDatabase } from './infrastructure/data/postgreSQL';
import 'reflect-metadata';

(() => {
  main();
})();

async function main() {
  await postgreSQLDatabase.connect();
  const server = new Server(env.port);
  await server.start();
}
