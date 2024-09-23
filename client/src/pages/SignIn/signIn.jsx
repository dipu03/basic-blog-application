import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { authApi } from "../../api";
import { toast } from "react-toastify";

function SignIn() {
  const { Login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const userRef = useRef();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (userRef.current) {
      // userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const userRes = await authApi.login({
        email,
        password,
      });
      Login(userRes.data);
      navigate(from, { replace: true });
      toast.success('Login Success.')

    } catch (err) {
      setLoading(false);
      setErrMsg(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="auth">
      <form onSubmit={handleSubmit} className="form">
        {errMsg && (
          <div className="alert-danger">
            <p>{errMsg}</p>
          </div>
        )}

        <div className="form-header-div">
          <h2>Welcome!</h2>
        </div>

        <div className="form-row">
          <label className="form-label">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            placeholder="Enter Your Registered Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="pass"
            value={password}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
          <label className="password-toggle-label">
            <input
              type="checkbox"
              onClick={togglePasswordVisibility}
              className="password-toggle-checkbox"
            />
            Show Password
          </label>
        </div>

        <button>
          <span>{loading ? "Loading..." : "Sign In"}</span>
        </button>

        <div className="extra-text-container">
          <Link to="/sign-up" className="text">
            No account. Sign Up?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
