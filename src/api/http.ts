import axios from "axios";

const http = axios.create({
  baseURL: "https://localhost:5240/api", // ⚠️ API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;