import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import Http from './axios';
import { buidConfig } from './config';
import { env } from '@shared/utils';
import { WhatsAppMessage, WhatsAppMessageResult } from '@domain/entities';

const whatsappApiHeaders = AxiosHeaders.concat({
  Authorization: `Bearer ${env.whatsapp.apiToken}`,
});

const _config = buidConfig(env.whatsapp.apiUrl, whatsappApiHeaders);

class Service extends Http {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  send = async (payload: WhatsAppMessage): Promise<WhatsAppMessageResult> => {
    const result = await this.post<WhatsAppMessageResult, WhatsAppMessage>(
      '/messages',
      payload,
    );
    return result.data;
  };
}

const services = new Service(_config);

export default services;
