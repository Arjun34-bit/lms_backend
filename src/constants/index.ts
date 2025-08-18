import * as dotenv from 'dotenv';
dotenv.config();

export const envConstant = {
  PORT: Number(process.env.PORT) || 8287,

  BASE_URL: process.env.BASE_URL || `https://lms-student-znlh.onrender.com`,

  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL || 'http://localhost:8289',

  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:8289',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/pcc',

  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_DB: Number(process.env.REDIS_DB) || 1,

  JWT_SECRET: process.env.JWT_SECRET || '',
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || '15d',

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION || '',
  AWS_BUCKET: process.env.AWS_BUCKET || '',
  AWS_ENDPOINT: process.env.AWS_ENDPOINT || '',

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',

  SENDER_EMAIL: process.env.SENDER_EMAIL || '',
  SENDER_PASSWORD: process.env.SENDER_PASSWORD || '',

  MINIO_BASE_URL: process.env.MINIO_BASE_URL || '',
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || '',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || '',
  PRIVATE_BUCKET_NAME: 'pcc-private',

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123', // For development fallback if hash is not set
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || '', // Store pre-hashed password here for production
  AUTHORIZED_ADMIN_PHONES: process.env.AUTHORIZED_ADMIN_PHONES || '', // Comma-separated list of authorized admin phone numbers
  PUBLIC_BUCKET_NAME: 'pcc-public',
};
