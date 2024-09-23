import httpStatus from 'http-status';

import { responseWrapper, ApiError, catchAsync, isValidMongoObjectId } from '../../utils';
import { Blog } from '../../models';

export const validCreateBlogBody = catchAsync(async (req, res, next) => {
	try {
		const { title, description } = req.body;

		if (!title || !description) {
			return responseWrapper(
				res,
				'',
				'Please Provide Required Fields: question, answer',
				httpStatus.BAD_REQUEST,
			);
		};
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

export const isBlogOwner = catchAsync(async (req, res, next) => {
	try {
		const { blogId } = req.params;
		const { user } = req.body;
		if (!isValidMongoObjectId(blogId)) {
			throw new ApiError(
				httpStatus.BAD_REQUEST,
				'Invalid blogId provided: Need a valid mongo Object Id',
			);
		}
		const blogDoc = await Blog.findById(blogId)

		if (!blogDoc) {
			return responseWrapper(
				res,
				'',
				'No document found with this id.',
				httpStatus.BAD_REQUEST,
			);
		};
		if (blogDoc.created_by.toString() !== user._id.toString()) {
			return responseWrapper(
				res,
				'',
				'You are not allowed to perform this action.',
				httpStatus.UNAUTHORIZED,
			);
		}
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

export const validateCreateCommentBody = catchAsync(async (req, res, next) => {
	try {
		const { comment, blog_id } = req.body;
		if (!comment || !blog_id) {
			return responseWrapper(
				res,
				'',
				'Please Provide Required Fields: comment, blog_id',
				httpStatus.BAD_REQUEST,
			);
		};
		if (!isValidMongoObjectId(blog_id)) {
			throw new ApiError(
				httpStatus.BAD_REQUEST,
				'Invalid blogId provided: Need a valid mongo Object Id',
			);
		}
		const blogDoc = await Blog.getById(blog_id)

		if (!blogDoc) {
			return responseWrapper(
				res,
				'',
				'No document found with this id.',
				httpStatus.BAD_REQUEST,
			);
		};
		req.body.blogDoc = blogDoc;
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