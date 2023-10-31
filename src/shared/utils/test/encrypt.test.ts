import { EncryptAdapter } from '../';

describe('test EncryptAdapter', () => {
  test('EncryptAdapter should be encrypt a string', () => {
    const encrypted = EncryptAdapter.hash('password');
    expect(encrypted).toBeDefined();
  });
  test('EncryptAdapter should be compare a string with encrypted string', () => {
    const password = 'password';
    const encrypted = EncryptAdapter.hash(password);
    expect(EncryptAdapter.compare(password, encrypted)).toBe(true);
  });
});
