import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { authApi } from "../../api";

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

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
      await authApi.register({
        name,
        email,
        password,
        confirm_password: confirmPassword,
      });
      navigate("/sign-in", { replace: true });
      toast.success('Registration Success. Please Login to continue')
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
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Enter Your name"
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
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

        <div className="form-row">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confirm Password"
            value={confirmPassword}
            placeholder="Enter Your Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <button>
          <span className="button__text">
            {loading ? "Loading..." : "Sign Up"}
          </span>
        </button>

        <div className="extra-text-container">
          <Link to="/sign-in" className="text">
            Already have an account. Sign In?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
