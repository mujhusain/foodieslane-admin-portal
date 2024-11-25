import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://pp7q7fwvoa.execute-api.us-west-2.amazonaws.com/dev", // Replace with your API base URL
  timeout: 10000, // Set a timeout for requests (optional)
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization token if available
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle error responses
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized errors (e.g., token expiration)
      Cookies.remove("authToken");
      window.location.href = "/auth/sign-in"; // Redirect to sign-in page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
