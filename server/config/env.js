import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` })
export const {
    PORT,
    SERVER_URL,
    NODE_ENV,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_RESET_PASSWORD_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
    EMAIL_USER,
    EMAIL_PASSWORD,
    DB_URI,
    CLIPDROP_API_KEY
} = process.env;
