import { RedisOptions } from "ioredis";
import { APP_CONFIG } from "./appConfig";

export const connection: RedisOptions = {
  host: APP_CONFIG.redis.host,
  port: APP_CONFIG.redis.port,
};
