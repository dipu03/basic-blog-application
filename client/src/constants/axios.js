import axios from "axios";
import { USER_API_BASE_URL } from "./index";

export const api = axios.create({
  baseURL: USER_API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const responseBody = async (response) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return response.data
};

export const Axios = {
  get: (url, params) => api.get(url, { params }).then(responseBody),
  post: (url, body) => api.post(url, body).then(responseBody),
  put: (url, body) => api.put(url, body).then(responseBody),
  delete: (url) => api.delete(url).then(responseBody),
};
