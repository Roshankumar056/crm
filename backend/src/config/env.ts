import "dotenv/config";

function req(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

const toBool = (v?: string) => (v ?? "").toLowerCase() === "true";

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "8080", 10),
  DATABASE_URL: req("DATABASE_URL"),

  JWT_ACCESS_SECRET: req("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: req("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: req("JWT_ACCESS_EXPIRES_IN"),
  JWT_REFRESH_EXPIRES_IN: req("JWT_REFRESH_EXPIRES_IN"),

  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10),
  LOG_LEVEL: process.env.LOG_LEVEL ?? "dev",

  SMTP_HOST: req("SMTP_HOST"),
  SMTP_PORT: parseInt(req("SMTP_PORT")),
  SMTP_SECURE: toBool(process.env.SMTP_SECURE),
  SMTP_USER: req("SMTP_USER"),
  SMTP_PASS: req("SMTP_PASS"),
  EMAIL_FROM: req("EMAIL_FROM"),
};
