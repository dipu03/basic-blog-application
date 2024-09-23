import httpStatus from 'http-status';
import { responseWrapper, catchAsync, pick } from '../../utils';
import { blogService } from '../../services';

export const createBlog = catchAsync(async (req, res) => {
	const body = pick(req.body, ['title', 'description', 'user']);
	const result = await blogService.createBlog(body);
	return responseWrapper(
		res,
		result,
		'New Blog Created Successfully.',
		httpStatus.CREATED,
	);
});

export const updateBlog = catchAsync(async (req, res) => {
	const params = pick(req.params, ['blogId']);
	const body = pick(req.body, ['title', 'description']);
	const result = await blogService.updateBlog(body, params);
	return responseWrapper(
		res,
		result,
		'Blog Updated Successfully',
		httpStatus.OK,
	);
});

export const getAllBlog = catchAsync(async (req, res) => {
	const roles = await blogService.getAllBlog(req.query);
	return responseWrapper(res, roles);
});

export const deleteBlog = catchAsync(async (req, res) => {
	const params = pick(req.params, ['blogId']);
	await blogService.deleteBlog(params);
	return responseWrapper(res, '', 'Delete Successfull.');
});

export const ViewblogDetails = catchAsync(async (req, res) => {
	const params = pick(req.params, ['blogId']);
	const response = await blogService.ViewblogDetails(params);
	return responseWrapper(res, response, '');
});

export const createCommentInBlog = catchAsync(async (req, res) => {
	const body = pick(req.body, ['blog_id', 'comment', 'user', 'blogDoc']);
	const response = await blogService.createCommentInBlog(body);
	return responseWrapper(res, response, 'Comment Successfully Created.');
});
