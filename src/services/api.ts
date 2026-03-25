import axios, { AxiosInstance, AxiosResponse } from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("[API] Response Error:", error.message);
    return Promise.reject(error);
  }
);

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
};

export const apiService = {
  async getPosts(): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await apiClient.get("/posts");
    return response.data;
  },

  async getPostById(id: number): Promise<Post> {
    const response: AxiosResponse<Post> = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await apiClient.get("/users");
    return response.data;
  },

  async getUserById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};

export default apiClient;
