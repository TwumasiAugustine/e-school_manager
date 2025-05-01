import dotenv from 'dotenv';

dotenv.config();

interface Config {
	PORT: number;
	SESSION_SECRET: string;
	MONGODB_URI: string;
	JWT_SECRET: string;
	NODE_ENV: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_PASS: string;
    SMTP_USER: string;
    FROM_NAME: string;
    FROM_EMAIL: string;
    MAX_FILE_SIZE: number;
    UPLOAD_PATH: string;
    CALLBACK_URL: string;
    CLIENT_URL: string;
    ALLOWED_ORIGINS: string[];
    
}

const {
    PORT = 3000,
    SESSION_SECRET,
    MONGODB_URI,
    CALLBACK_URL,
    JWT_SECRET,
    NODE_ENV,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_PASS,
    SMTP_USER,
    FROM_NAME,
    FROM_EMAIL,
    MAX_FILE_SIZE,
    UPLOAD_PATH,
    CLIENT_URL,
    ALLOWED_ORIGINS,

} = process.env;


if (
    !SESSION_SECRET ||
    !MONGODB_URI ||
    
    !CALLBACK_URL ||
    !CLIENT_URL ||
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !FROM_NAME ||
    !FROM_EMAIL ||
    !MAX_FILE_SIZE ||
    !UPLOAD_PATH ||
    !ALLOWED_ORIGINS || 
    !NODE_ENV ||
    !JWT_SECRET || 
    !PORT
) {
    throw new Error('One or more environment variables are missing.');
    console.log(
        SESSION_SECRET,
        MONGODB_URI,
        CALLBACK_URL,
        CLIENT_URL,
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASS,
        FROM_NAME,
        FROM_EMAIL,
        MAX_FILE_SIZE,
        UPLOAD_PATH,
        ALLOWED_ORIGINS,
        NODE_ENV,
        JWT_SECRET,
        PORT,
    );
}

const config: Config = {
    PORT: Number(PORT),
    SESSION_SECRET,
    MONGODB_URI,
    JWT_SECRET,
    NODE_ENV,
    SMTP_HOST,
    SMTP_PORT: Number(SMTP_PORT),
    SMTP_PASS,
    SMTP_USER,
    FROM_NAME,
    FROM_EMAIL,
    MAX_FILE_SIZE: Number(MAX_FILE_SIZE),
    UPLOAD_PATH,
    CALLBACK_URL,
    CLIENT_URL,
    ALLOWED_ORIGINS: ALLOWED_ORIGINS.split(','),
};

export default config;
