import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getBlogDetails, updateBlog } from "../../store/slices/blog.slice";
import Spinner from "../../components/Spinner";
import { STATUSES } from "../../constants/types";

const EditBlog = () => {
  const dispatch = useDispatch();
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { blogDetails, status } = useSelector((state) => state.blog);

  // Initialize state with empty strings
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getBlogDetails({ id: blogId }));
  }, [dispatch, blogId]);

  useEffect(() => {
    if (blogDetails) {
      setTitle(blogDetails.title || "");
      setDescription(blogDetails.description || ""); 
    }
  }, [blogDetails]);

  const validate = () => {
    const validationErrors = {};
    if (!title) validationErrors.title = "Title is required.";
    if (!description) validationErrors.description = "Description is required.";
    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    dispatch(updateBlog({ id: blogId, updatedBlogData: { title, description }, toast }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (status === STATUSES.LOADING) {
    return <Spinner />;
  }

  if (status === STATUSES.ERROR) {
    return <div>Failed to load blog details</div>;
  }

  return (
    <div className="add">
      <h1>Edit Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter blog description"
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EditBlog;
