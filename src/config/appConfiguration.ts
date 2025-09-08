import "dotenv/config";
import { cleanEnv, host, makeValidator, num, port, str, url } from "envalid"; // optional but recommended

const strOrNum = makeValidator<string | number>((input) => {
  if (/^\d+$/.test(input)) {
    return Number(input); // treat purely numeric values as number
  }
  return input; // otherwise, keep as string
});

// 🔒 validate + type env vars at startup
const env = cleanEnv(process.env, {
  //General
  APP_NAME: str(),
  APP_URL: url(),
  API_PREFIX: str({ default: "api" }),
  API_VERSION: str({ default: "v1" }),
  NODE_ENV: str({
    default: "development",
    choices: ["development", "production", "staging", "test"],
  }),
  PORT: port({ default: 5000 }),
  JWT_SECRET: str({ default: "fallback-secret" }),
  JWT_EXPIRY: strOrNum({ default: "1h" }), // format like "1h", "7d", etc.
  SALT_ROUNDS: num({ default: 10 }),
  // Database
  DB_NAME: str({ default: "test" }),
  DB_HOST: host({ default: "127.0.0.1" }),
  DB_USER: str({ default: "root" }),
  DB_PASSWORD: str({ default: "" }),
  REDIS_HOST: host({ default: "127.0.0.1" }),
  REDIS_PORT: num({ default: 6379 }),
  //Mailer
  MAIL_SMTP_HOST: host({ default: "localhost" }),
  MAIL_PORT: num({ default: 587 }),
  MAIL_USERNAME: str(),
  MAIL_PASSWORD: str(),
  MAIL_ENCRYPTION: str(),
  MAIL_FROM: str({ default: "test@example.com" }),
  MAILER_SENDER_NAME: str({ default: "Test Account" }),
  //Misc
  DEFAULT_PROFILE_IMAGE_URL: str(),
  BASE_UPLOAD_URL: str({ default: "" }),
  BASE_AVATAR_FOLDER: str({ default: "" }),
});

export const APP_CONFIG = {
  appUrl: env.APP_URL,
  apiPrefix: `${env.API_PREFIX}/${env.API_VERSION}`,
  apiBaseUrl: `${env.APP_URL}/${env.API_PREFIX}/${env.API_VERSION}`,
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  saltRounds: env.SALT_ROUNDS,
  jwt: {
    secret: env.JWT_SECRET,
    expiry: env.JWT_EXPIRY,
  },
  db: {
    name: env.DB_NAME,
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  mailer: {
    host: env.MAIL_SMTP_HOST,
    port: env.MAIL_PORT,
    username: env.MAIL_USERNAME,
    password: env.MAIL_PASSWORD,
    encryption: env.MAIL_ENCRYPTION,
    fromAddress: env.MAIL_FROM,
    fromName: env.MAILER_SENDER_NAME,
  },
  misc: {
    baseUploadUrl: env.BASE_UPLOAD_URL,
    baseAvatarFolder: env.BASE_AVATAR_FOLDER,
    defaultProfileImageUrl: env.DEFAULT_PROFILE_IMAGE_URL,
  },
};
