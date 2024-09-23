import "./styles/global.scss";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store/index";
import { AuthProvider } from "./contexts/AuthContext";
import WrapperView from "./components/WrapperView";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <Provider store={store}>
      <BrowserRouter>
      <WrapperView>
        <App />
        </WrapperView>
      </BrowserRouter>
    </Provider>
  </AuthProvider>
);
