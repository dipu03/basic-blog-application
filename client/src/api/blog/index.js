import { Axios } from "../../constants/axios";

export const getAllBlogs = async (params) => {
    const res = await Axios.get("blogs", params);
    return res;
};

export const createBlog = async (data) => {
    const res = await Axios.post("blogs", data);
    return res;
};

export const updateBlog = async (data, id) => {
    const res = await Axios.put(`blogs/${id}`, data);
    return res;
};

export const deleteBlog = async (id) => {
    const res = await Axios.delete(`blogs/${id}`);
    return res;
};

export const getBlogDetails = async (id) => {
    const res = await Axios.get(`blogs/${id}`);
    return res;
};

export const createCommentInBlog = async (data) => {
    const res = await Axios.post("blogs/comment", data);
    return res;
};