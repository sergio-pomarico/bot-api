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
};
