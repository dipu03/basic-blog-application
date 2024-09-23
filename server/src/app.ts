import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import httpStatus from 'http-status';
import multer from 'multer';

import config from './configs/config';
import corsConfigs from './configs/corsConfigs';
import { successHandler, errorHandler } from './configs/morgan';
import {
	ApiError,
	apiErrorHandler,
	responseWrapper,
	credentials,
	getQueryParams,
} from './utils';
import routes from './routes/v1';
import { queryTypesArr } from './configs/constantTypes';

const app = express();
const upload = multer()

// Initialize MongoDB connection
import('./configs/mongoConnection');


// set security HTTP headers
app.use(
	helmet.contentSecurityPolicy({
		useDefaults: true,
		directives: {
			'img-src': [
				"'self' data:",
				'*.google-analytics.com',
				'*.vimeocdn.com',
			],
			'script-src': [
				"'self'",
				'*.polyfill.io',
				"'unsafe-eval'",
				"'unsafe-inline'",
			],
			'default-src': [
				"'self'",
				'*.google-analytics.com',
				'*.gstatic.com',
				'*.googleapis.com',
				'vimeo.com',
				'*.vimeo.com',
			],
		},
	}),
);

// Validate Query Parameters
app.use(getQueryParams(queryTypesArr));

// parse json request body
app.use(express.json({ limit: '100mb' }));
// parse urlencoded request body
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// gzip compression
app.use(compression());

if (config.essentials.env !== 'test') {
	app.use(successHandler);
	app.use(errorHandler);
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

app.use(credentials);
app.use(cors(corsConfigs));

app.get('/ping', (req: Request, res: Response) => {
	return responseWrapper(res, '', 'Hello World |->|Gateway:5000 !! pong 😊 pong 😊');
});

// Added multer with all v1 api routes
app.use('/api/v1', upload.none(),  routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
	next(
		new ApiError(
			httpStatus.NOT_FOUND,
			'Oops! The endpoint you are looking for is not available.',
		),
	);
});

// error handling
app.use(apiErrorHandler);

export default app;
