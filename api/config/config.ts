import dotenv from "dotenv";

dotenv.config();

type ConfigOption = string | ((key: string | undefined) => any);

type KeyTypeMap<T extends Record<string, ConfigOption>> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends (key: string | undefined) => infer TFunctionReturn
    ? TFunctionReturn
    : never;
};

function createConfig<TConfig extends Record<string, ConfigOption>>(
  config: TConfig
): {
  get: <T extends keyof TConfig>(key: T) => KeyTypeMap<TConfig>[T];
} {
  return {
    get: (key: string) => {
      const value = process.env[key];
      const defaultOrFn = config[key];
      if (typeof defaultOrFn === "function") {
        return defaultOrFn(value);
      }
      if (!value) {
        return defaultOrFn;
      }
      return value;
    },
  } as any;
}

export const config = createConfig({
  ALGOLIA_APPLICATION_ID: "",
  ALGOLIA_ADMIN_API_KEY: "",
  CLOUDINARY_API_KEY: "",
  CLOUDINARY_API_SECRET: "",
  CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/baublet/auto/upload",
  DATABASE: "production",
  DB_CONNECTION_STRING: "",
  JWT_SECRET: "Don't use the default value, please!",
  MAILGUN_API_KEY: "",
  MAILGUN_BASE_URL: "",
  MAILGUN_DOMAIN: "",
  NETLIFY: "false",
  NODE_ENV: "production",
  PUBLIC_URL: otherEnvValuesOrDefault(["URL"], "http://localhost:8080"),
  RECURRING_TASKS: "true",
  SALT: "Don't use the default, please!",
  SUPPRESS_ALGOLIA: "true",
  SUPPRESS_CONSOLE_LOGGING: "true",
  SUPPRESS_EMAILS: "true",
});

function otherEnvValuesOrDefault(
  vars: string[],
  defaultValue: string
): (value: string | undefined) => string {
  return (value) => {
    if (value) {
      return value;
    }
    for (const envVar of vars) {
      const value = process.env[envVar];
      if (value) {
        return value;
      }
    }
    return defaultValue;
  };
}
