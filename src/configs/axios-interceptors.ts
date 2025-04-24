import userStore from "@/stores/user-store";
import axios from "axios";


axios.interceptors.request.use(
  (config) => {
    const user = userStore.value;
    if (user && user.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
