import { config } from 'dotenv';
import { get } from 'env-var';

config();

export const env = {
  port: get('PORT').required().asPortNumber(),
  database: {
    port: get('DB_PORT').required().asPortNumber(),
    host: get('DB_HOST').required().asString(),
    name: get('DB_NAME').required().asString(),
    password: get('DB_PASSWORD').required().asString(),
    username: get('DB_USER').required().asString(),
  },
  whatsapp: {
    challenge: get('WS_CHALLENGE').required().asString(),
    secret: get('WS_APP_SECRET').required().asString(),
    apiToken: get('WS_API_TOKEN').required().asString(),
    apiUrl: get('WS_API_URL').required().asString(),
  },
  redis: {
    url: get('REDIS_URL').required().asString(),
  },
};

export type config = typeof env;
