import { Server } from './infrastructure/server';
import { env } from './config/env';
import { PostgreSQLDatabase } from './data/postgre-sql';

(() => {
  main();
})();

async function main() {
  await PostgreSQLDatabase.connect(env.database);
  const server = new Server(env.port);
  await server.start();
}
