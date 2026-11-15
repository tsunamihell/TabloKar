import 'dotenv/config';
import { randomBytes } from 'node:crypto';

const configuredSecret = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && (!configuredSecret || configuredSecret.length < 32)) {
  throw new Error('JWT_SECRET must contain at least 32 characters in production.');
}
// An unset development secret invalidates sessions on restart instead of using a public key.
export const JWT_SECRET = configuredSecret || randomBytes(32).toString('hex');
