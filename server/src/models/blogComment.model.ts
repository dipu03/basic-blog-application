/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Schema, Model } from 'mongoose';
import { ApiError } from '../utils';
import httpStatus from 'http-status';
import {
	addTimestamps,
	globalQueryFilters,
	toJSON,
} from '../configs/mongoPlugins';

export interface IBlogComment extends Document {
	comment: string;
	blog_id: Schema.Types.ObjectId;
	created_at: Date;
	created_by?: Schema.Types.ObjectId;
	updated_at: Date;
	updated_by?: Schema.Types.ObjectId;
	deleted_at?: Date;
	deleted_by?: Schema.Types.ObjectId;
}

interface IBlogCommentModel extends Model<IBlogComment> {
	getById(BlogCommentId: string): Promise<IBlogComment | null>;
}

const BlogCommentSchema = new Schema<IBlogComment>(
	{
		comment: {
			type: String,
			required: true,
		},
		blog_id: {
			type: Schema.Types.ObjectId,
			ref: 'Blog',
			required: true,
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
		created_by: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
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
		collection: 'blog_comments',
	},
);

BlogCommentSchema.plugin(globalQueryFilters);
BlogCommentSchema.plugin(toJSON);
BlogCommentSchema.plugin(addTimestamps);

BlogCommentSchema.statics.getById = async function (
	BlogCommentId: string,
): Promise<IBlogComment | null> {
	try {
		return await this.findOne({ _id: BlogCommentId});
	} catch (error) {
		throw new ApiError(
			error.statusCode
				? error.statusCode
				: httpStatus.INTERNAL_SERVER_ERROR,
			error.message,
		);
	}
};

export const BlogComment: IBlogCommentModel = mongoose.model<IBlogComment, IBlogCommentModel>('BlogComment', BlogCommentSchema);
