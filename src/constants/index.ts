import * as dotenv from 'dotenv';
dotenv.config();

export const envConstant = {
  PORT: Number(process.env.PORT) || 3001,

  BASE_URL: process.env.BASE_URL || `http://localhost:3001`,

  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/pcc',

  REDIS_HOST: process.env.REDIS_HOST || 'localhost',

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
  SENDER_PASSWORD: process.env.SENDER_PASSWORD || ''
};
