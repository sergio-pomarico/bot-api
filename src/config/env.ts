import { config } from 'dotenv';
import { get } from 'env-var';

config();

export const env = {
  port: get('PORT').required().asPortNumber(),
};
