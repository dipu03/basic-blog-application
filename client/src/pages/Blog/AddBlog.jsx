import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../../store/slices/blog.slice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    dispatch(createBlog({ updatedBlogData: { title, description }, toast }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="add">
      <h1>Add New Blog</h1>
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
          {errors.description && (
            <span className="error">{errors.description}</span>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddBlog;
