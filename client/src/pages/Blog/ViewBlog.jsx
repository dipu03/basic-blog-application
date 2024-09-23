import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBlogDetails } from "../../store/slices/blog.slice";
import { STATUSES } from "../../constants/types";
import Spinner from '../../components/Spinner';

const BlogDetails = () => {
  const dispatch = useDispatch();
  const { blogId } = useParams();
  
  const { blogDetails, status } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getBlogDetails({ id: blogId }));
  }, [dispatch, blogId]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  if (status === STATUSES.LOADING) {
    return <Spinner />;
  }

  if (status === STATUSES.ERROR) {
    return <div>Failed to load blog details</div>;
  }

  return (
    <div className="blog-details">
      <div className="blog-content">
        <h1>{blogDetails?.title}</h1>
        <p>{getText(blogDetails?.description)}</p>
        <span className="author">Author: {blogDetails?.created_by?.name}</span>
        <span className="date">Published: {new Date(blogDetails?.updated_at).toLocaleDateString()}</span>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {blogDetails?.comments?.length ? (
          blogDetails.comments.map((comment) => (
            <div key={comment._id} className="comment">
              <span className="comment-author">{comment.created_by.name}</span>
              <p>{comment.comment}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
