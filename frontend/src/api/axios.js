import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

function normalizeToken(token) {
  if (!token) return null;
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

function getStoredToken() {
  if (typeof window === "undefined") return null;

  const keys = ["token", "access_token", "accessToken", "authToken"];

  for (const key of keys) {
    const value =
      localStorage.getItem(key) || sessionStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return null;
}

export function setAuthToken(token) {
  const rawToken = token?.replace(/^Bearer\s+/i, "") || "";
  const normalized = normalizeToken(rawToken);

  if (normalized) {
    const keys = ["token", "access_token", "accessToken", "authToken"];

    keys.forEach((key) => {
      localStorage.setItem(key, rawToken);
      sessionStorage.setItem(key, rawToken);
    });

    api.defaults.headers.common.Authorization = normalized;
  } else {
    const keys = ["token", "access_token", "accessToken", "authToken"];

    keys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    delete api.defaults.headers.common.Authorization;
  }
}

export function clearAuthToken() {
  setAuthToken(null);
}

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = normalizeToken(token);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
    }
    return Promise.reject(error);
  }
);

export default api;