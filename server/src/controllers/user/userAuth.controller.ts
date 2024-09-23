import httpStatus from 'http-status';
import { userAuthService } from '../../services';
import { catchAsync, pick, responseWrapper } from '../../utils';

export const register = catchAsync(async (req, res) => {
	const body = pick(req.body, [
		'name',
		'email',
		'password',
		'confirm_password',
	]);
	await userAuthService.register(body);
	return responseWrapper(
		res,
		'',
		'User Registerd Successfully. Please Login to continue.',
		httpStatus.CREATED,
	);
});

export const login = catchAsync(async (req, res) => {
	const body = pick(req.body, ['name', 'email', 'password', 'ip_address']);
	const response = await userAuthService.login(body);
	return responseWrapper(res, response, 'Successfully Logged in.');
});

export const logout = catchAsync(async (req, res) => {
	const body = pick(req.body, ['refresh_token', 'tokenDoc']);
	const response = await userAuthService.logout(body);
	return responseWrapper(res, response, 'Successfully Logged out.');
});

export const refreshAuth = catchAsync(async (req, res) => {
	const body = pick(req.body, ['refresh_token', 'tokenDoc', 'user']);
	const response = await userAuthService.refreshAuth(body);
	return responseWrapper(res, response);
});
