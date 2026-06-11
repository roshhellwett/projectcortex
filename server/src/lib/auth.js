import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_only_for_dev_cortex_2026';

export function signActivationToken(payload) {
  // Sign a JWT valid for the entire 7-day period.
  // It includes the cryptographically secure seed.
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyActivationToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
