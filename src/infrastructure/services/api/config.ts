import { AxiosHeaders, AxiosRequestConfig } from 'axios';

/**
 *
 * @param {string} url
 * @return {AxiosRequestConfig}
 */
export const buidConfig = (
  url: string,
  customHeaders?: AxiosHeaders,
): AxiosRequestConfig => {
  const commonHeaders = {
    'Content-Type': 'application/json',
  };

  /**
   * build Axios config request
   */
  const config: AxiosRequestConfig = {
    baseURL: url,
    withCredentials: true,
    timeout: 30000,
    headers: { ...commonHeaders, ...customHeaders },
  };
  return config;
};
