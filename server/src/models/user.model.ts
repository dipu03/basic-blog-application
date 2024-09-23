/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Model, Schema } from 'mongoose';
import {
	addTimestamps,
	globalQueryFilters,
	toJSON,
} from '../configs/mongoPlugins';

export interface IUser extends Document {
	_id: Schema.Types.ObjectId;
	name: string;
	email: string;
	password: string;
	status: string;
	created_at: Date;
	created_by?: Schema.Types.ObjectId;
	updated_at: Date;
	updated_by?: Schema.Types.ObjectId;
	deleted_at?: Date;
	deleted_by?: Schema.Types.ObjectId;
	comparePassword(candidatePassword: string): Promise<boolean>;
}
interface IUserModel extends Model<IUser> {
	isEmailTaken(email: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			maxlength: 200,
			required: true,
		},
		password: {
			type: String,
			trim: true,
			required: true,
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
		created_by: {
			type: Schema.Types.ObjectId,
			default: null,
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
		collection: 'users',
	},
);

userSchema.plugin(globalQueryFilters);
userSchema.plugin(toJSON);
userSchema.plugin(addTimestamps);

userSchema.statics.isEmailTaken = async function (email: string) {
	const user = await this.findOne({ email});
	return !!user;
};

export const User: IUserModel = mongoose.model<IUser, IUserModel>(
	'User',
	userSchema,
);
