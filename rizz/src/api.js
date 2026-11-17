import axios from "axios";

const api = axios.create({
  baseURL: "https://paynthra247.onrender.com/api",
  withCredentials: true,
});

export default api;
