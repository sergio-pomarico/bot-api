import axios, {
  AxiosError,
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

/**
 * @class HTTP Class is a es6 wrapper class for axios.
 * @param {import("axios").AxiosRequestConfig} config - axios Request Config.
 * @link [AxiosRequestConfig](https://github.com/axios/axios#request-config)
 */
class HTTPClient {
  private instance: AxiosInstance;
  private config: AxiosRequestConfig;
  private _token: string | undefined;

  interceptors: {
    /**
     * The **Request** interceptor will be call rigth before the `http request`
     * @summary
     * This a useful method especially if you need to send a token on each request.
     */
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    /**
     * The **Response** interceptor will be call rigth before the `http request` is received.
     * @summary
     * This a useful method especially if you need to send a token on each request.
     */
    response: AxiosInterceptorManager<AxiosResponse>;
  };

  /**
   * Creates an instance of HTTP.
   * @param {import("axios").AxiosRequestConfig} config
   */
  constructor(config: AxiosRequestConfig) {
    this.config = config;
    this.instance = axios.create(this.config);
    this.interceptors = this.instance.interceptors;
    this.injectToken();
  }

  /**
   * Add Authorization header to request when token in setter.
   * @return void
   */
  injectToken() {
    this.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (this.token !== undefined) {
          config!.headers!.Authorization = this.token;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );
  }

  /**
   * Sets Token.
   * @param {string} token - token.
   */
  set setToken(token: string) {
    this._token = token;
  }

  /**
   * Gets Token.
   * @returns {string} token.
   */
  get token(): string | undefined {
    return this._token;
  }

  /**
   * Generic request.
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP axios response payload.
   */
  request<T = unknown, R = AxiosResponse<T>>(
    config: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.request(config);
  }

  /**
   * HTTP GET method.
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} HTTP `axios` response payload.
   */
  get<T = unknown, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.get<T, R>(url, config);
  }

  /**
   * HTTP POST method.
   * @template T - `TYPE`: expected object.
   * @template B - `BODY`: body request object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {B} data - payload to be send as the `request body`,
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP [axios] response payload.
   */
  public post<T, B, R = AxiosResponse<T>>(
    url: string,
    data: B,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.post(url, data, config);
  }

  /**
   * HTTP PUT method.
   * @template T - `TYPE`: expected object.
   * @template B - `BODY`: body request object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {B} data - payload to be send as the `request body`,
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP [axios] response payload.
   */
  put<T = unknown, R = AxiosResponse<T>>(
    url: string,
    data: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.put<T, R>(url, data, config);
  }

  /**
   * HTTP DELETE method, `statusCode`: 204 No Content.
   * @template T - `TYPE`: expected object.
   * @template R - `RESPONSE`: expected object inside a axios response format.
   * @param {string} url - endpoint you want to reach.
   * @param {import("axios").AxiosRequestConfig} [config] - axios request configuration.
   * @returns {Promise<R>} - HTTP [axios] response payload.
   */
  delete<T = unknown, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.instance.delete<T, R>(url, config);
  }
}

export default HTTPClient;
