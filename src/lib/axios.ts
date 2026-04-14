import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

export const api = axios.create({
  baseURL: baseURL,
});
