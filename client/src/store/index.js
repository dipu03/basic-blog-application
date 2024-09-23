import { configureStore } from "@reduxjs/toolkit";
import { ENV } from "../constants";

import blogReducer from "./slices/blog.slice";

const store = configureStore({
  reducer: {
    blog: blogReducer,
  },
  devTools:
    ENV !== "production"
});


export default store;