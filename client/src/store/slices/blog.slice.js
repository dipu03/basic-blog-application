import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blogApi } from "../../api";
import { STATUSES, defaultRowCountPerPage } from "../../constants/types";

const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        blogsData: {},
        blogDetails: {},
        totalRows: 0,
        currentPage: 0,
        currentPageRowsCount: defaultRowCountPerPage,
        error: "",
        status: STATUSES.IDLE,
    },
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllBlogs.pending, (state) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(getAllBlogs.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.blogsData = action.payload;
                const {
                    arg: { page },
                } = action.meta;
                state.currentPage = page;
            })
            .addCase(getAllBlogs.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.error = action.payload.message;
            })
            .addCase(getBlogDetails.pending, (state) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(getBlogDetails.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.blogDetails = action.payload;
            })
            .addCase(getBlogDetails.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.error = action.payload.message;
            })
            .addCase(deleteBlog.pending, (state) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                const {
                    arg: { id },
                } = action.meta;
                if (id) {
                    state.blogsData = { rows: [...state.blogsData.rows.filter((item) => item._id !== id)], count: state.blogsData.count - 1 };
                }
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.error = action.payload.message;
            })
            .addCase(createBlog.pending, (state) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                const newBlog = action.payload;
                state.blogsData = {
                    rows: [...state.blogsData.rows, newBlog],
                    count: state.blogsData.count + 1,
                };

            })
            .addCase(createBlog.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.error = action.payload.message;
            })
            .addCase(updateBlog.pending, (state) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                const {
                    arg: { id },
                } = action.meta;
                if (id) {
                    state.blogsData.rows = state.blogsData.rows.map((item) =>{
                        if(item._id === id) {
                            item.title = action.payload.title;
                            item.description = action.payload.description
                        }
                        return item
                    }
                    );
                }
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.error = action.payload.message;
            })
    },
});


export const { setCurrentPage } = blogSlice.actions;
export default blogSlice.reducer;


export const getAllBlogs = createAsyncThunk(
    "blogs/getAllBlogs",
    async ({ limit, page, sortBy = "ASC" }, { rejectWithValue }) => {
        try {
            const response = await blogApi.getAllBlogs({ limit, page, sortBy });
            return response.data;
        } catch (err) {
            if (err && err.response) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue("An error occurred");
            }
        }
    }
);

export const getBlogDetails = createAsyncThunk(
    "blogs/getBlogDetails",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await blogApi.getBlogDetails(id);
            return response.data;
        } catch (err) {
            if (err && err.response) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue("An error occurred");
            }
        }
    }
);

export const createBlog = createAsyncThunk(
    "blog/createBlog",
    async ({ updatedBlogData, toast }, { rejectWithValue }) => {
        try {
            const { title, description } = updatedBlogData;
            const response = await blogApi.createBlog({ title, description });
            toast.success("New Blog Added Successfully");
            return response.data;
        } catch (err) {
            if (err && err.response) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue("An error occurred");
            }
        }
    }
);

export const updateBlog = createAsyncThunk(
    "blog/updateBlog",
    async ({ id, updatedBlogData, toast }, { rejectWithValue }) => {
        try {
            const { title, description } = updatedBlogData;
            const response = await blogApi.updateBlog({ title, description }, id);
            toast.success("Blog Updated Successfully");
            return response.data;
        } catch (err) {
            if (err && err.response) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue("An error occurred");
            }
        }
    }
);

export const deleteBlog = createAsyncThunk(
    "blog/deleteBlog",
    async ({ id, toast }, { rejectWithValue }) => {
        try {
            const response = await blogApi.deleteBlog(id);
            toast.success("Blog Deleted Successfully");
            return response.data;
        } catch (err) {
            if (err && err.response) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue("An error occurred");
            }
        }
    }
);

