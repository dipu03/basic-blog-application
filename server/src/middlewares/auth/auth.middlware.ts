/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import validator from 'validator';

import {
	responseWrapper,
	ApiError,
	catchAsync,
	validatePassword,
} from '../../utils';
import {
	tokenTypes,
} from '../../configs/constantTypes';

import {
	User,
} from '../../models';
import { tokenService } from '../../services';
import mongoose from 'mongoose';


export const verifyAuthJWTToken = catchAsync(async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if(!token){
			return responseWrapper(
				res,
				'',
				'Unauthorized : please authenticate.',
				httpStatus.NOT_FOUND,
			);
		};
		const tokenPayload = await tokenService.verifyToken(token, tokenTypes.ACCESS);

		const user = await User.findOne({_id: new mongoose.Types.ObjectId(`${tokenPayload.sub}`)});

		if (!user) {
			return responseWrapper(
				res,
				'',
				'User Not Found',
				httpStatus.NOT_FOUND,
			);
		}

		req.body.user = user;
		req.body.tokenPayload = tokenPayload;
		req.body.ip_address = req.ip;
		next();
	} catch (error) {
		next(
			new ApiError(
				error.statusCode
					? error.statusCode
					: httpStatus.INTERNAL_SERVER_ERROR,
				error.message,
			),
		);
	}
});

export const verifyRefreshAuthJWTToken = catchAsync(async (req, res, next) => {
	try {
		const { refresh_token } = req.body;
		const tokenDoc = await tokenService.verifyToken(refresh_token, tokenTypes.REFRESH);
		
		const user = await User.findOne({_id: tokenDoc.user_id});
		if(!user){
			return responseWrapper(
				res,
				'',
				'User Not Found',
				httpStatus.NOT_FOUND,
			);
		}

		req.body.user = user;
		req.body.tokenDoc = tokenDoc;
		req.body.ip_address = req.ip;
		next();
	} catch (error) {
		next(
			new ApiError(
				error.statusCode
					? error.statusCode
					: httpStatus.INTERNAL_SERVER_ERROR,
				error.message,
			),
		);
	}
});

export const validateRegisterUserBody = catchAsync(async (req, res, next) => {
	try {
		const {
			name,
			email,
			password,
			confirm_password,
		} = req.body;

		if (
			!name ||
			!email ||
			!password ||
			!confirm_password
		) {
			return responseWrapper(
				res,
				'',
				'Please Enter Required Fields: name, email, password, confirm_password',
				httpStatus.BAD_REQUEST,
			);
		}
		if (!validator.isEmail(email) || name.length === 0) {
			return responseWrapper(
				res,
				'',
				'Invalid Email',
				httpStatus.BAD_REQUEST,
			);
		}

		if (await User.isEmailTaken(email)) {
			return responseWrapper(
				res,
				'',
				'Email already taken',
				httpStatus.BAD_REQUEST,
			);
		}

		if (!validatePassword(password)) {
			return responseWrapper(
				res,
				'',
				'Password should have a minimum length of 8 characters and must have at least 2 digits and No Blank Space',
				httpStatus.BAD_REQUEST,
			);
		}

		if (password !== confirm_password) {
			return responseWrapper(
				res,
				'',
				'Password and Confirm Password must be equal.',
				httpStatus.BAD_REQUEST,
			);
		}
		req.headers.ip_address = req.ip;
		next();
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
});

export const validateSignInReqBody = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return responseWrapper(
			res,
			'',
			'Please Enter Required Fields : email, password',
			httpStatus.BAD_REQUEST,
		);
	}
	if (!validator.isEmail(email)) {
		return responseWrapper(
			res,
			'',
			'Invalid email format',
			httpStatus.BAD_REQUEST,
		);
	}
	req.body.ip_address = req.ip;
	next();
});