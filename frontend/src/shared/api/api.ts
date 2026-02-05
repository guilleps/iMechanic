import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export const apiCookie = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

// Separate client for refresh to avoid interceptor recursion
export const refreshClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});