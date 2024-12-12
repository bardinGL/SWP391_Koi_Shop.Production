import axios from "./Customize-Axios";

const createConsignment = (data, salePrice) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  let url = `controller/create-consignmentitem`;
  if (salePrice !== undefined) {
    url += `?salePrice=${salePrice}`;
  }

  return axios.post(url, data, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const updateConsignmentItemStatus = (id, status, type) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.put(
    `controller/update-consignment-item/${id}`,
    {
      status, // Trạng thái consignmentItemStatus
      productItemUpdates: {
        type, // Trạng thái productItemStatus
      },
    },
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const fetchAllConsignments = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get("controller/get-all-consignments", {
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
  });
};

const getConsignmentsByItemId = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get(`Consignment/item/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const getConsignmentsForUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.get(`controller/get-user-consignment-items`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

const checkoutConsignment = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.post(
    `Consignment/checkout/${id}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
};

const deleteConsignmentItem = (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found! Please log in again.");
  }

  return axios.delete(
    `Consignment/remove-item/${id}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
};

export {
  createConsignment,
  updateConsignmentItemStatus,
  fetchAllConsignments,
  getConsignmentsByItemId,
  getConsignmentsForUser,
  checkoutConsignment,
  deleteConsignmentItem,
};
