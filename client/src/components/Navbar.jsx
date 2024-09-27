import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Logo from "../img/logo.png";

const Navbar = () => {
  const { user, signed, Logout } = useAuth();
  const navigate = useNavigate()
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    Logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo" onClick={handleLogoClick }>
          <img src={Logo} alt="" />
        </div>
        <div className="links">
          {signed ? (
            <>
              <Link className="link" to="/create-blog">
                  Add blog
                </Link>
              <span className="link">
                <strong>Welcome, {user.name}</strong>
              </span>
  
              <span className="link" onClick={handleLogout}>
                logout
              </span>
            </>
          ) : (
            <Link className="link" to="/sign-in">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
