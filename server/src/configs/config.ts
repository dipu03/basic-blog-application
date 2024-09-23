import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define the environment variables schema
const envVarsSchema = Joi.object({
	APP_NAME: Joi.string().required().description('Your Application Name'),
	NODE_ENV: Joi.string()
		.valid('production', 'development', 'test')
		.required(),
	PORT: Joi.number().default(5000),

	MONGODB_URL: Joi.string().required().description('Mongo DB url'),

	JWT_SECRET: Joi.string().required().description('JWT secret key'),
	JWT_ACCESS_EXPIRATION_DAYS: Joi.number()
		.default(7)
		.description('days after which access tokens expire'),
	JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
		.default(30)
		.description('days after which refresh tokens expire'),
	JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
		.default(10)
		.description('minutes after which reset password token expires'),
	JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
		.default(10)
		.description('minutes after which verify email token expires'),

	DEFAULT_API_DATA_LIMIT: Joi.number().default(15),
	DEFAULT_ORDERING: Joi.string().valid('asc', 'desc').required(),
	DEFAULT_PAGE_NO: Joi.number().default(1),
	ACCESSDOMAINS: Joi.string().description(
		'All allow origin URL comma-separated',
	),
	DEFAULT_TIMEZONE: Joi.string()
		.default('UTC')
		.description('Default Timezone for application'),
}).unknown();

// Validate the environment variables
const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: 'key' } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

// Define the configuration object and its types
interface Config {
	essentials: {
		appName: string;
		env: string;
		port: number;
	};

	databases: {
		mongodb: {
			url: string;
		};
	};

	constants: {
		jwt: {
			secret: string;
			accessExpirationDays: number;
			refreshExpirationDays: number;
			resetPasswordExpirationMinutes: number;
			verifyEmailExpirationMinutes: number;
		};
		accessDomains?: string;
		defaultLimit: number;
		defaultDataOrder: string;
		defaultPageNo: number;
		defaultTimezone: string;
	};
}

// Export the configuration object
const config: Config = {
	essentials: {
		appName: envVars.APP_NAME,
		env: envVars.NODE_ENV,
		port: envVars.PORT,
	},

	databases: {
		mongodb: {
			url: envVars.MONGODB_URL,
		},
	},

	constants: {
		jwt: {
			secret: envVars.JWT_SECRET,
			accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
			refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
			resetPasswordExpirationMinutes:
				envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
			verifyEmailExpirationMinutes:
				envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
		},
		accessDomains: envVars.ACCESSDOMAINS,
		defaultLimit: envVars.DEFAULT_API_DATA_LIMIT,
		defaultDataOrder: envVars.DEFAULT_ORDERING,
		defaultPageNo: envVars.DEFAULT_PAGE_NO,
		defaultTimezone: envVars.DEFAULT_TIMEZONE,
	},
};

export default config;
