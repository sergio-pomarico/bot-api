import { JWTAdapter } from '../jwt';

describe('test JWTAdapter', () => {
  test('JWTAdapter should be generate token', async () => {
    const token = await JWTAdapter.generateToken({ id: 1 });
    expect(token).toBeDefined();
  });
  test('JWTAdapter should be emit a error with a invalid token', async () => {
    const decoded = await JWTAdapter.verifyToken('invalid-token');
    expect(decoded).toBeNull();
  });
  test('JWTAdapter should validate a token', async () => {
    const token = await JWTAdapter.generateToken({ id: 1 });
    const decoded = await JWTAdapter.verifyToken(token!);
    expect(decoded).toBeDefined();
  });
});
