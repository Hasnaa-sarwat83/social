
import axios from "axios";

const api = axios.create({
  baseURL: "https://route-posts.routemisr.com",
});

export const signup = async (data) => {
  return await api.post("/users/signup", data);
};

export const login = async (data) => {
  return await api.post("/users/signin", data);
};

export default api;