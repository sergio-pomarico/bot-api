export class CustomHTTPError extends Error {
  constructor(
    public readonly statusCode: number,
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
