import { ENV } from "./env";
import { Redis } from "ioredis";

const redis = new Redis(ENV.redisURL);

redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err) => console.error("Redis Error", err));

export { redis };
