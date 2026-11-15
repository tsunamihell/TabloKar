import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password.js';

describe('Password Hashing Utility', () => {
  it('should hash a password correctly and produce a valid bcrypt hash', async () => {
    const plain = 'tablokar123';
    const hash = await hashPassword(plain);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(plain);
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('should verify matching password returns true', async () => {
    const plain = 'Admin@Abrand1403';
    const hash = await hashPassword(plain);

    const isValid = await verifyPassword(plain, hash);
    expect(isValid).toBe(true);
  });

  it('should return false when password does not match', async () => {
    const plain = 'correct-password';
    const wrong = 'wrong-password';
    const hash = await hashPassword(plain);

    const isValid = await verifyPassword(wrong, hash);
    expect(isValid).toBe(false);
  });

  it('should reject empty passwords when hashing', async () => {
    await expect(hashPassword('')).rejects.toThrow();
  });
});

