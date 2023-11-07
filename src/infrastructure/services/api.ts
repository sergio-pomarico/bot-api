import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import Http from './axios';
import { buidConfig } from './config';
import { env } from '@shared/utils';
import {
  WhatsAppPayloadResponse,
  WhatssAppTextMessagePayload,
} from '@domain/entities/whatsapp';

const whatsappApiHeaders = AxiosHeaders.concat({
  Authorization: `Bearer ${env.whatsapp.apiToken}`,
});

const _config = buidConfig(env.whatsapp.apiUrl, whatsappApiHeaders);

class Service extends Http {
  constructor(config: AxiosRequestConfig) {
    super(config);
  }

  send = async (
    payload: WhatssAppTextMessagePayload,
  ): Promise<WhatsAppPayloadResponse> => {
    const result = await this.post<
      WhatsAppPayloadResponse,
      WhatssAppTextMessagePayload
    >('/messages', payload);
    return result.data;
  };
}

const services = new Service(_config);

export default services;
