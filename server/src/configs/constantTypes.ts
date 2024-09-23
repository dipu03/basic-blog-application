export const tokenTypes = {
	ACCESS: 'ACCESS',
	REFRESH: 'REFRESH',
	VERIFY_EMAIL: 'EMAIL_VERIFICATION',
	FORGOT_PASSWORD: 'FORGOT_PASSWORD',
	RESET_PASSWORD: 'RESET_PASSWORD',
	SESSION: 'SESSION',
	TWO_FACTOR_AUTH: 'TWO_FACTOR_AUTH',
	ACCOUNT_RECOVERY: 'ACCOUNT_RECOVERY',
	PAYMENT_AUTHORIZATION: 'PAYMENT_AUTHORIZATION',
	DEVICE_VERIFICATION: 'DEVICE_VERIFICATION',
};

export const queryTypes = {
	sortBy: 'sortBy',
	limit: 'limit',
	page: 'page',
	offset: 'offset',
};

export const mongoOperationsTypes = {
	FIND: 'find',
	FIND_ONE: 'findOne',
	UPDATE_ONE: 'updateOne',
	UPDATE_MANY: 'updateMany',
	DELETE_ONE: 'deleteOne',
	DELETE_MANY: 'deleteMany',
	CREATE: 'create',
	INSERT_MANY: 'insertMany',
	FIND_ONE_AND_UPDATE: 'findOneAndUpdate',
	FIND_ONE_AND_DELETE: 'findOneAndDelete',
};

export const tokenTypesArr: string[] = [
	'ACCESS',
	'REFRESH',
	'EMAIL_VERIFICATION',
	'FORGOT_PASSWORD',
	'RESET_PASSWORD',
	'SESSION',
	'TWO_FACTOR_AUTH',
	'ACCOUNT_RECOVERY',
	'PAYMENT_AUTHORIZATION',
	'DEVICE_VERIFICATION',
];

export const queryTypesArr = ['sortBy', 'limit', 'page'];

export const mongoOperationsTypesArray = [
	'find',
	'findOne',
	'updateOne',
	'updateMany',
	'deleteOne',
	'deleteMany',
	'create',
	'insertMany',
	'findOneAndUpdate',
	'findOneAndDelete',
];

