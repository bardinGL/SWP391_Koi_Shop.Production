import axios from "./Customize-Axios";

const fetchAllProducts = () => {
  return axios.get("Category/get-all-shop-products");
};
const fetchAllCategories = () => {
  return axios.get("Category/get-all-categories");
};


const getProductById = (id) => {
  return axios.get(`ProductItem/get-product-item/${id}`);
};

const createProduct = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.post("Product/create-product", {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updateProduct = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.put(`Product/update-product/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const deleteProduct = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }
  return axios.delete(`Product/delete-product/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export {
  fetchAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllCategories
};
