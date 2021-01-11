import * as dotenv from 'dotenv';
dotenv.config();
export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,

  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://localhost:4200',
  CONNECTION_NAME: process.env.CONNECTION_NAME || 'postgreSQL',
  ORM_USED: process.env.ORM_USED || 'postgres',
  CONFIGURATION_TYPE: process.env.CONFIGURATION_TYPE || 'DEVELOPMENT',
  POSTGRES_URL: process.env.POSTGRES_URL || '::',
  POSTGRES_DB: process.env.POSTGRES_DB || 'postgres',
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
  LOGGER_FILE: process.env.LOGGER_FILE || 'log/file.log',
  JWT_KEY: process.env.JWT_KEY || '',

  JWT_EXPIRES_MS: process.env.JWT_EXPIRES_MS || 400000000,

  SERVICE: process.env.SERVICE || '',
  HOST_SMTP: process.env.HOST_SMTP || '',
  HOST_MAIL_LOGGER: process.env.HOST_MAIL_LOGGER || '',
  ASSOCIATE_EMAIL: process.env.ASSOCIATE_EMAIL || '',

  AUTH_USER: process.env.AUTH_USER || '',
  AUTH_PASSWORD: process.env.AUTH_PASSWORD || '',
  SECRET_KEY_DEVELOPMENT: process.env.SECRET_KEY_DEVELOPMENT || '',

  SECRET_KEY_PRODUCTION: process.env.SECRET_KEY_PRODUCTION || '',
  SECRET_KEY_WEBHOOK: process.env.SECRET_KEY_WEBHOOK || '',
  PROTOCOL_HTTP: process.env.PROTOCOL_HTTP || 'https',
  EMAIL: process.env.EMAIL || '',
  STATEMENT_DESCRIPTOR: process.env.STATEMENT_DESCRIPTOR || '',
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || ''
};
