const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Env var ${key} is not defined`);
  return value;
};

export const config = {
  api: getEnvVar('API'),
};