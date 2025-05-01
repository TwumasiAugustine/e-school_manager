import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import config from './config/config';
import logger from './utils/logger';
import errorHandler from './utils/errorHandler';

const { PORT, MONGODB_URI, NODE_ENV, ALLOWED_ORIGINS } = config;

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Database connection
const connectDB = async () => {
	try {
		await mongoose.connect(MONGODB_URI!);
		logger.info('Connected to MongoDB');
	} catch (error) {
		logger.error('Error connecting to MongoDB:', error);
		process.exit(1);
	}
};

// Middleware setup
const initializeMiddleware = () => {
	// CORS configuration
	const allowedOrigins = ALLOWED_ORIGINS
		? ALLOWED_ORIGINS
		: ['http://localhost:5173'];

	app.use(
		cors({
			origin: (origin, callback) => {
				if (!origin || allowedOrigins.includes(origin)) {
					callback(null, true);
				} else {
					callback(new Error(`Not allowed by CORS: ${origin}`));
				}
			},
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
			allowedHeaders: [
				'Content-Type',
				'Authorization',
				'X-Requested-With',
				'Accept',
				'Origin',
			],
		}),
	);

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(errorHandler);
};

// Routes
const initializeRoutes = () => {
	app.use('/api/auth', require('./routes/auth'));
	app.use('/api/students', require('./routes/students'));
	app.use('/api/teachers', require('./routes/teachers'));
	app.use('/api/classes', require('./routes/classes'));
	app.use('/api/attendance', require('./routes/attendance'));
	app.use('/api/grades', require('./routes/grades'));
	app.use('/api/fees', require('./routes/fees'));
};

// Error handling
const initializeErrorHandling = () => {
	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		logger.error(err.stack);
		res.status(500).json({
			success: false,
			message: 'Something went wrong!',
			error: NODE_ENV === 'development' ? err.message : undefined,
		});
	});
};

// Production setup
const initializeProduction = () => {
	if (NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname, 'client/build')));
		app.get('*', (req: Request, res: Response) => {
			res.sendFile(
				path.resolve(__dirname, 'client', 'build', 'index.html'),
			);
		});
	}
};

// Startup sequence
const startServer = async () => {
	await connectDB();
	initializeMiddleware();
	initializeRoutes();
	initializeErrorHandling();
	initializeProduction();

	server.listen(PORT, () => {
		logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
	});
};

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
	if (error.code === 'EADDRINUSE') {
		logger.error(`Port ${PORT} is already in use`);
		process.exit(1);
	}
	throw error;
});

// Start the application
startServer();
