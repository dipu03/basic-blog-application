/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import { ApiError } from '../../utils';
import { IUser, User } from '../../models';
import { BodyDefinition } from '../../types/RouteDefinition';

import {
	generateAuthAccessTokens,
	generateAuthTokens,
} from '../common/token.service';

export const register = async (body: BodyDefinition) => {
	try {
		const { name, email, password } = body;

		const salt = bcrypt.genSaltSync(10);
		const userObj = {
			email,
			name,
			password: bcrypt.hashSync(password, salt),
		};
		const userDoc = await User.create(userObj);
		if (!userDoc) {
			throw new ApiError(
				httpStatus.INTERNAL_SERVER_ERROR,
				'Failed to create new user account',
			);
		}

		return '';
	} catch (error) {
		throw new ApiError(
			error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

export const login = async (body: BodyDefinition) => {
	try {
		const { email, password } = body;

		if (!validator.isEmail(email)) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Email.');
		}

		const userDoc: IUser = await User.findOne({ email });

		if (!userDoc) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found.');
		}

		const passwordMatch = await bcrypt.compare(password, userDoc.password);
		if (!passwordMatch) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect Password.');
		}

		const tokens = await generateAuthTokens(userDoc);

		delete tokens.refresh.id;
		return {
			id: userDoc._id,
			name: userDoc.name,
			email: userDoc.email,
			tokens: tokens,
		};
	} catch (error) {
		throw new ApiError(
			error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

export const refreshAuth = async (body: BodyDefinition) => {
	try {
		const { user } = body;
		const token = await generateAuthAccessTokens(user);
		return {
			tokens: {
				access: token,
			},
		};
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

export const logout = async (
	body: BodyDefinition
) => {
	try {
		const { tokenDoc } = body;
		const isLoggedout = await tokenDoc.deleteOne();

		if (!isLoggedout) {
			throw new ApiError(
				httpStatus.INTERNAL_SERVER_ERROR,
				'Failed to Logout.',
			);
		}

		return '';
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};
