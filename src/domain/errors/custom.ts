export class CustomHTTPError extends Error {
  constructor(
    public readonly httpCode: number,
    public readonly message: string,
  ) {
    super(message);
  }

  static badRequest(message: string) {
    return new CustomHTTPError(400, message);
  }

  static unauthorize(message: string) {
    return new CustomHTTPError(401, message);
  }

  static forbiden(message: string) {
    return new CustomHTTPError(403, message);
  }

  static notFound(message: string) {
    return new CustomHTTPError(404, message);
  }

  static internalServer(message = 'Internal Server Error') {
    return new CustomHTTPError(500, message);
  }
}

// {
//   "error": {
//       "code": "17",
//       "title": "Wrong username or password",
//       "microservice": "user",
//       "subdomain": "Auth",
//       "description": "Wrong username or password, 1/4",
//       "httpCode": 401,
//       "type": "PAYLOAD_CONTENT_ERROR",
//       "id": "user-Auth-17"
//   }
// }

// "clientId": "2035cf1d-7c29-5dbf-b38a-933bb93a7979",
// "lastLogin": "2023-10-30T14:56:39.578Z",
