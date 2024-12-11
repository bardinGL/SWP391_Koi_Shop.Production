import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Dynamically set base URL
});

// Response interceptor for handling API responses
instance.interceptors.response.use(
  (response) => (response.data ? response.data : { statusCode: response.status }),
  (error) => {
    let res = {};
    if (error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    return res;
  }
);

export default instance;
