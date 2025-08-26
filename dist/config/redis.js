"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const env_1 = require("./env");
const ioredis_1 = require("ioredis");
const redis = new ioredis_1.Redis(env_1.ENV.redisURL);
exports.redis = redis;
redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err) => console.error("Redis Error", err));
