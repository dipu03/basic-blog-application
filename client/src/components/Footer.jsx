import Logo from "../img/logo.png";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="" />
      <span>
        Made with ♥️ by <b>Dipankar Bhoumik</b>.
      </span>
    </footer>
  );
};

export default Footer;