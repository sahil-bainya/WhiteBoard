import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // yeh line — cookies automatically attach hongi
});

export default api;
