import axios from "axios";
import { authStorage } from "@/utils/authStorage";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const session = authStorage.get();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});
