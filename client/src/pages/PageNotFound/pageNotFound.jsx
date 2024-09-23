import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="page-not-found">
      <div className="content">
        <h2 className="error-message">Oops! Page not found.</h2>
        <h1 className="error-code">
          <span>4</span>
          <span>0</span>
          <span>4</span>
        </h1>
      </div>
      <div className="button-div">
        <button className="go-back-button" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  );
}
