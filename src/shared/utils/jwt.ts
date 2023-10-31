import jwt from 'jsonwebtoken';

export class JWTAdapter {
  static generateToken(
    payload: object,
    duration = '1H',
  ): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(payload, 'SEED', { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        return resolve(token!);
      });
    });
  }

  static verifyToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, 'SEED', (err, decode) => {
        if (err) return resolve(null);
        return resolve(decode as T);
      });
    });
  }
}
