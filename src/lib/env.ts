export const validateEnv = (variable: string | undefined, name: string) => {
  if (!variable) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return variable;
};

export const MONGODB_URI = validateEnv(process.env.MONGODB_URI, "MONGODB_URI");
export const UPSTASH_REDIS_REST_URL = validateEnv(
  process.env.UPSTASH_REDIS_REST_URL,
  "UPSTASH_REDIS_REST_URL"
);
export const UPSTASH_REDIS_REST_TOKEN = validateEnv(
  process.env.UPSTASH_REDIS_REST_TOKEN,
  "UPSTASH_REDIS_REST_TOKEN"
);
