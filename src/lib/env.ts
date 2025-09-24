export const validateEnv = (variable: string | undefined, name: string) => {
  if (!variable) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return variable;
};

export const MONGODB_URI = validateEnv(process.env.MONGODB_URI, "MONGODB_URI");
