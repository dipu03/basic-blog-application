/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Schema, Model } from 'mongoose';
import { ApiError } from '../utils';
import httpStatus from 'http-status';
import {
	addTimestamps,
	globalQueryFilters,
	toJSON,
} from '../configs/mongoPlugins';

export interface IBlog extends Document {
	title: string;
	slug: string;
	description: string | null;
	comments?: [Schema.Types.ObjectId],
	created_at: Date;
	created_by?: Schema.Types.ObjectId;
	updated_at: Date;
	updated_by?: Schema.Types.ObjectId;
	deleted_at?: Date;
	deleted_by?: Schema.Types.ObjectId;
}

interface IBlogModel extends Model<IBlog> {
	getById(BlogId: string): Promise<IBlog | null>;
	deleteById(BlogId: string): Promise<void>;
	getAll(limit: number, offset: number): Promise<IBlog[]>;
	updateById(BlogId: string, updates: Partial<IBlog>): Promise<IBlog | null>;
}

const BlogSchema = new Schema<IBlog>(
	{
		title: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		comments: [{
			type: Schema.Types.ObjectId,
			ref: 'BlogComment', 
		}],
		created_at: {
			type: Date,
			default: Date.now,
		},
		created_by: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		updated_at: {
			type: Date,
			default: Date.now,
		},
		updated_by: {
			type: Schema.Types.ObjectId,
			default: null,
		},
		deleted_at: {
			type: Date,
			default: null,
		},
		deleted_by: {
			type: Schema.Types.ObjectId,
			default: null,
		},
	},
	{
		collection: 'blogs',
	},
);

BlogSchema.plugin(globalQueryFilters);
BlogSchema.plugin(toJSON);
BlogSchema.plugin(addTimestamps);

BlogSchema.statics.getById = async function (
	BlogId: string,
): Promise<IBlog | null> {
	try {

		return await this.findOne({ _id: BlogId })
			.select('title slug description updated_at')
			.populate({
				path: 'created_by', 
				select: 'name email', 
			})
			.populate({
				path: 'comments', 
				select: 'comment', 
				populate: {
					path: 'created_by', 
					select: 'name email', 
				},
			});
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

BlogSchema.statics.deleteById = async function (BlogId: string): Promise<void> {
	try {
		const Blog = await this.deleteOne(
			{ _id: BlogId },
		);
		if (!Blog) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
		}
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

BlogSchema.statics.getAll = async function (
	limit: number,
	offset: number,
): Promise<any> {
	try {
		// Get the total count of blogs
		const totalCount = await this.countDocuments();
		const blogs = await this.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'created_by',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$unwind: '$user',
			},
			{
				$project: {
					title: 1,
					slug: 1,
					description: 1,
					user: { _id: 1, name: 1, email: 1 }, 
					updated_at: 1,
				},
			},
			{ $sort: { updated_at: -1 } },
			{ $skip: offset },
			{ $limit: limit },
		]);

		return { count: totalCount, rows: blogs };
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};


BlogSchema.statics.updateById = async function (
	BlogId: string,
	updates: Partial<IBlog>,
): Promise<IBlog | null> {
	try {
		return await this.findOneAndUpdate({ _id: BlogId }, updates, {
			new: true,
		});
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

export const Blog: IBlogModel = mongoose.model<IBlog, IBlogModel>(
	'Blog',
	BlogSchema,
);
