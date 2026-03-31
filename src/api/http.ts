import axios from "axios";

const http = axios.create({
  baseURL: "https://localhost:7282/api", // ⚠️ API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;