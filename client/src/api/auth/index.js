import { Axios } from "../../constants/axios";

export const login = async (data) => {
  const res = await Axios.post("auth/user/login", data);
  return res;
};

export const register = async (data) => {
  const res = await Axios.post("auth/user/register", data);
  return res;
};

export const logout = async (data) => {
  const res = await Axios.post("auth/user/logout", data);
  return res;
};

export const refresAuth = async (data) => {
  const res = await Axios.post("auth/user/refresh-auth", data);
  return res;
};
