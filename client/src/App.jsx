import { Routes, Route } from "react-router-dom";

import MinimalLayout from "./layout/MinimalLayout";
import MainLayout from "./layout/MainLayout";

import Home from "./pages/Home/home";
import PageNotFound from "./pages/PageNotFound/pageNotFound";
import SignIn from "./pages/SignIn/signIn";
import SignUp from "./pages/SignUp/signUp";
import AddBlog from "./pages/Blog/AddBlog";
import BlogDetails from "./pages/Blog/ViewBlog";
import EditBlog from "./pages/Blog/EditBlog";

function App() {
  return (
    <div className="app">
      <div className="container">
        <Routes>
          <Route element={<MinimalLayout />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>

          <Route  element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:blogId" element={<BlogDetails />} />
            <Route path="/create-blog" element={<AddBlog />} />
            <Route path="/update-blog/:blogId" element={<EditBlog />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
