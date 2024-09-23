/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import slugify from 'slugify';

import { Blog, BlogComment, IBlog } from '../../models';
import { ApiError, mongoFunctions } from '../../utils';
import {
	BodyDefinition,
	ParamsDefinition,
	QueryDefinition,
} from '../../types/RouteDefinition';
import { mongoOperationsTypes } from '../../configs/constantTypes';

export const createBlog = async (body: any): Promise<any> => {
	try {
		const { title, description, user } = body;

		const blogObj = {
			title,
			slug: slugify(title, { lower: true }),
			description,
			created_by: user._id,
		};

		const blogDoc = await mongoFunctions({
			schema: Blog,
			createData: blogObj,
			operationType: mongoOperationsTypes.CREATE,
		});
		if (!blogDoc) {
			throw new ApiError(
				httpStatus.INTERNAL_SERVER_ERROR,
				'Failed to create new Blog',
			);
		}
		return {
			...blogDoc.toObject(),
			user: {
				name: user.name,
				email: user.email,
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

export const getAllBlog = async (query: QueryDefinition): Promise<IBlog[]> => {
	try {
		const { limit, offset } = query;
		const blogDoc = await Blog.getAll(limit, offset);
		return blogDoc;
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

interface UpdateBlogRequest {
	title?: string;
	description?: string;
}

export const updateBlog = async (
	body: UpdateBlogRequest,
	params: ParamsDefinition,
): Promise<any> => {
	try {
		const { blogId } = params;
		await Blog.updateById(blogId, body);
		return body;
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

export const deleteBlog = async (params: ParamsDefinition): Promise<object> => {
	try {
		const { blogId } = params;
		await BlogComment.deleteMany({blog_id: blogId});
		await Blog.deleteById(blogId);
		return {};
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

export const ViewblogDetails = async (
	params: ParamsDefinition,
): Promise<object> => {
	try {
		const { blogId } = params;
		const blogDoc = await Blog.getById(blogId);
		return blogDoc;
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

export const createCommentInBlog = async (
	body: BodyDefinition,
): Promise<object> => {
	try {
		const { comment, user, blog_id, blogDoc } = body;

		const commentObj = {
			comment,
			blog_id,
			created_by: user._id,
		};

		const commentDoc = await mongoFunctions({
			schema: BlogComment,
			createData: commentObj,
			operationType: mongoOperationsTypes.CREATE,
		});
		if (!commentDoc) {
			throw new ApiError(
				httpStatus.INTERNAL_SERVER_ERROR,
				'Failed to commnet.',
			);
		}

		// Add the comment to the blog's comments array
		blogDoc.comments.push(commentDoc._id);
		await blogDoc.save();

		return commentDoc;
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};
