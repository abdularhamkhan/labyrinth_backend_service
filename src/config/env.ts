import { configDotenv } from "dotenv";
// Only load .env file in development (Railway provides env vars directly)
if (process.env.NODE_ENV !== "production") {
  configDotenv();
}

export const ENV = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  redisURL: process.env.REDIS_URL || "redis://redis:6379",
  supabaseURL: process.env.SUPABASE_URL!,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  jwtSecret: process.env.JWT_SECRET!,
  optimiseApiKeyPrisma: process.env.OPTIMIZE_API_KEY!,

  // Kafka Configuration
  kafkaBrokers: process.env.KAFKA_BROKERS?.split(",") || ["kafka:9092"],
  kafkaClientId: process.env.KAFKA_CLIENT_ID || "labyrinth-backend",
  kafkaGroupId: process.env.KAFKA_GROUP_ID || "labyrinth-backend-group",
  // Kafka TLS/SASL (optional)
  // If your Kafka cluster requires SSL or SASL authentication, set these in the environment.
  kafkaSsl: (process.env.KAFKA_SSL || "false").toLowerCase() === "true",
  kafkaSaslMechanism: process.env.KAFKA_SASL_MECHANISM || undefined,
  kafkaSaslUsername: process.env.KAFKA_SASL_USERNAME || undefined,
  kafkaSaslPassword: process.env.KAFKA_SASL_PASSWORD || undefined,

  // Pusher Configuration (for real-time features)
  pusherAppId: process.env.PUSHER_APP_ID,
  pusherKey: process.env.PUSHER_KEY,
  pusherSecret: process.env.PUSHER_SECRET,
  pusherCluster: process.env.PUSHER_CLUSTER || "us2",

  // Cloudinary Configuration
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  // AWS Configuration
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION || "us-east-1",
  awsS3Bucket: process.env.AWS_S3_BUCKET,

  // Email Configuration
  // We currently rely on Supabase for auth-related emails and direct signup flows.
  // SES and Resend configuration are optional and disabled/commented to keep the flow simple.
  sesSmtpHost: process.env.SES_SMTP_HOST || "email-smtp.us-east-1.amazonaws.com",
  sesSmtpPort: parseInt(process.env.SES_SMTP_PORT || "587"),
  sesSmtpUser: process.env.SES_SMTP_USER || undefined,
  sesSmtpPassword: process.env.SES_SMTP_PASSWORD || undefined,
  sesFromEmail: process.env.SES_FROM_EMAIL || "noreply@labyrinth-platform.com",
  sesFromName: process.env.SES_FROM_NAME || "Labyrinth Platform",
  sesRegion: process.env.SES_REGION || "us-east-1",
  // Resend (optional) - disabled by default
  resendApiKey: process.env.RESEND_API_KEY || undefined,
  resendFromEmail: process.env.RESEND_FROM_EMAIL || undefined,
  resendFromName: process.env.RESEND_FROM_NAME || undefined,
};
