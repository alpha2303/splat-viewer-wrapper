export interface Config {
  DATABASE_CONN_STRING: string;
  AWS_S3_CLOUDFRONT_URL: string;
}

const validateConfig = (envVar: string, varName: string) => {
  if (!envVar || envVar === "") {
    throw new Error(`Config variable is not set: ${varName}`);
  }
  return envVar;
};

const loadConfig = () => {
  return {
    DATABASE_CONN_STRING: validateConfig(
      process.env.DATABASE_CONN_STRING,
      "DATABASE_CONN_STRING",
    ),
    AWS_S3_CLOUDFRONT_URL: validateConfig(
      process.env.AWS_S3_CLOUDFRONT_URL,
      "AWS_S3_CLOUDFRONT_URL",
    ),
  } satisfies Config;
};

export const config: Config = loadConfig();
