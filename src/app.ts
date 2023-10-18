import { Server } from './infrastructure/server';
import { env } from './config/env';

const server = new Server(env.port);

server.start();
