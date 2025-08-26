"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
exports.ENV = {
    port: process.env.PORT || 3000,
    redisURL: process.env.REDIS_URL || "redis://localhost:6379",
    supabaseURL: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.JWT_SECRET,
    optimiseApiKeyPrisma: process.env.OPTIMIZE_API_KEY,
};
