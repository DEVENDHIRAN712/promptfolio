export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing. Safe authentication token handling requires JWT_SECRET.');
  }
  return secret;
};
