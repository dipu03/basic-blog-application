import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Spinner from '../../components/Spinner';
import { getAllBlogs, deleteBlog } from "../../store/slices/blog.slice";
import { STATUSES } from "../../constants/types";
import { createCommentInBlog} from "../../api/blog";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import Sweetalert from "../../constants/SweetAlert";

const Home = () => {
  const { user, signed } = useAuth();
  const dispatch = useDispatch();
  const { blogsData, status } = useSelector((state) => state.blog);
  const navigate = useNavigate();
  
  const [comment, setComment] = useState({});
  const [isCommentVisible, setIsCommentVisible] = useState({});

  useEffect(() => {
    dispatch(getAllBlogs({ limit: 100, page: 1, sortBy: "DESC" }));
  }, [dispatch]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handleCommentToggle = (postId) => {
    setIsCommentVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentChange = (postId, e) => {
    setComment((prev) => ({ ...prev, [postId]: e.target.value }));
  };

  const handleCommentSubmit = async (postId) => {
    if (comment[postId]) {
      try {
        await createCommentInBlog({ blog_id: postId, comment: comment[postId] });
        toast.success("Comment added successfully.");
        setComment((prev) => ({ ...prev, [postId]: '' }));
        handleCommentToggle(postId);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleEdit = (postId) => {
    navigate(`/update-blog/${postId}`)
  };

  const handleDelete = async (postId) => {

    let status = await Sweetalert.confirmation(
      'Are you sure you want to delete this blog?'
    )
    if (status.isConfirmed) {
      dispatch(deleteBlog({ id: postId, toast }))
    }
  };

  if (status === STATUSES.LOADING) {
    return <Spinner />;
  }

  if (status === STATUSES.ERROR) {
    return <div>Failed to load blogs</div>;
  }

  return (
    <div className="home">
      <div className="posts">
        {blogsData?.rows?.map((post) => (
          <div className="post" key={post._id}>
            <div className="blog-content">
              <Link className="link" to={`/blog/${post._id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.description)}</p>
              <span className="author">Author: {post?.user?.name}</span>
              <span className="date">Published: {new Date(post?.updated_at).toLocaleDateString()}</span>

              {signed && post.user._id === user.sub ? (
                <div className="post-buttons">
                  <button onClick={() => handleEdit(post._id)}>Edit</button>
                  <button onClick={() => handleDelete(post._id)}>Delete</button>
                </div>
              ) : (
                signed && <button onClick={() => handleCommentToggle(post._id)}>
                  {isCommentVisible[post._id] ? 'Hide Comment' : 'Comment'}
                </button>
              )}

              {isCommentVisible[post._id] && signed && (
                <div className="comment-input">
                  <input
                    type="text"
                    value={comment[post._id] || ''}
                    onChange={(e) => handleCommentChange(post._id, e)}
                    placeholder="Write your comment..."
                  />
                  <button onClick={() => handleCommentSubmit(post._id)}>Submit</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
