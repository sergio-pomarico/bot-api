/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
}
