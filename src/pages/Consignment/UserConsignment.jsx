/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import {
  getConsignmentsForUser,
  checkoutConsignment,
  updateConsignmentItemStatus,
  createOrderConsignment,
} from "../../services/ConsignmentService";
import { createPayment, callBackPayment } from "../../services/PaymentService";
import { useNavigate, useLocation } from "react-router-dom";
import FishSpinner from "../../components/FishSpinner";
import { toast } from "react-toastify";
import "./UserConsignment.css";
import ConfirmationModal from "../../components/ConfirmationModal";
import { createPaymentForCOD } from "../../services/PaymentService";
import { getOrderByUser } from "../../services/OrderService";
import { UserContext } from "../../contexts/UserContext";
import { getProdItemById } from "../../services/ProductItemService";
import PropTypes from "prop-types";

const UserConsignment = () => {
  const [consignments, setConsignments] = useState([]);
  const [statusTab, setStatusTab] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToCancel, setItemToCancel] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [completedOrders, setCompletedOrders] = useState([]);
  const { user } = useContext(UserContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  useEffect(() => {
    if (!user.auth) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    fetchConsignments();
    fetchCompletedOrdersWithConsignmentId();
    // Kiểm tra callback từ VNPay
    const urlParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");

    if (vnp_ResponseCode === "00") {
      handlePaymentCallback();
    } else if (vnp_ResponseCode) {
      toast.error("Thanh toán thất bại. Vui lòng thử lại.");
    }
  }, [location, user, navigate]);

  const fetchConsignments = async () => {
    try {
      const response = await getConsignmentsForUser();
      console.log(response);
      setConsignments(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch consignments error:", error);
      toast.error("Không thể tải danh sách ký gửi");
      setConsignments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedOrdersWithConsignmentId = async () => {
    try {
      const response = await getOrderByUser();
      const ordersWithConsignmentId = response?.data?.filter(
        (order) => order.consignmentId
      );

      ordersWithConsignmentId?.sort(
        (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
      );

      setCompletedOrders(ordersWithConsignmentId || []);
    } catch (error) {
      console.error("Error fetching completed orders:", error);
    }
  };

  const handlePaymentCallback = async () => {
    try {
      const response = await callBackPayment();
      if (response.data) {
        const orderId = response.data.orderId;

        if (orderId) {
          await updateConsignmentItemStatus(orderId, "CheckedOut");
          await fetchConsignments();
          toast.success("Thanh toán thành công!");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Payment callback error:", error);
      toast.error("Có lỗi xảy ra khi xác nhận thanh toán");
    }
  };

  const handlePayment = async (consignment, item) => {
    try {
      setIsProcessing(true);

      const checkoutResponse = await checkoutConsignment(item.itemId);

      if (!checkoutResponse?.data || checkoutResponse.statusCode !== 201) {
        throw new Error(checkoutResponse.messageError || "Checkout failed");
      }

      const orderId = checkoutResponse.data.orderId;

      if (paymentMethods[item.itemId] === "cod") {
        try {
          const codResponse = await createPaymentForCOD({ orderId });
          if (codResponse?.data) {
            await updateConsignmentItemStatus(item.itemId, "CheckedOut");
            await fetchConsignments();
            toast.success(
              "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng."
            );
            navigate("/");
          } else {
            throw new Error("COD payment creation failed.");
          }
        } catch (error) {
          console.error("Error creating COD payment:", error);
          toast.error(
            "Không thể tạo thanh toán khi nhận hàng. Vui lòng thử lại sau."
          );
        }
      } else {
        const paymentData = {
          orderDescription:
            paymentMethods[item.itemId] === "bank"
              ? `Thanh toán ký gửi: ${item.name}`
              : `Thanh toán ký gửi COD: ${item.name}`,
          orderType: "consignment",
          name: item.name,
          orderId: orderId,
        };

        const paymentResponse = await createPayment(paymentData);

        await updateConsignmentItemStatus(item.itemId, "CheckedOut");
        await fetchConsignments();

        if (paymentMethods[item.itemId] === "bank") {
          if (paymentResponse?.data) {
            window.location.href = paymentResponse.data;
          } else {
            throw new Error("No payment URL received");
          }
        } else {
          toast.success(
            "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng."
          );
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.message || "Không thể xử lý thanh toán. Vui lòng thử lại sau."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelItem = (itemId) => {
    setItemToCancel(itemId);
    setIsConfirmModalOpen(true);
  };

  const confirmCancelItem = async () => {
    if (!itemToCancel) return;

    try {
      const response = await updateConsignmentItemStatus(
        itemToCancel,
        "Cancelled"
      );

      if (response.data) {
        setConsignments((prevConsignments) =>
          prevConsignments.map((consignment) => ({
            ...consignment,
            items: consignment.items.map((item) =>
              item.itemId === itemToCancel
                ? { ...item, status: "Cancelled" }
                : item
            ),
          }))
        );
        toast.success("Huỷ ký gửi thành công!");
      }
    } catch (error) {
      console.error("Error cancelling consignment:", error);
      toast.error("Huỷ ký gửi thất bại");
    } finally {
      setIsConfirmModalOpen(false);
      setItemToCancel(null);
    }
  };

  const getConsignmentCountByStatus = (status) => {
    if (!Array.isArray(consignments)) {
      return 0;
    }

    const itemCount = consignments.filter(
      (consignment) => consignment.consignmentItemStatus === status
    );
    return itemCount.length;
  };

  const filterConsignmentsByStatus = (status) => {
    if (!Array.isArray(consignments)) return [];

    return consignments
      .filter((consignment) => {
        switch (status) {
          case "Pending":
            return consignment.consignmentItemStatus === "Pending";
          case "Approved":
            return consignment.consignmentItemStatus === "Approved";
          case "Checkedout":
            return consignment.consignmentItemStatus === "Checkedout";
          case "Cancelled":
            return consignment.consignmentItemStatus === "Cancelled";
          case "Paid":
            return consignment.consignmentItemStatus === "Paid";
          default:
            return false;
        }
      })
      .map((consignment) => {
        // Tính giá gốc từ fee (Giả sử fee là giá đã biết)
        const originalPrice = (consignment.fee / 15) * 100;
        return {
          ...consignment,
          category:
            consignment.productItemType === "ShopUser"
              ? "Cá Gửi Bán"
              : "Cá Gửi Chăm Sóc",
          originalPrice: originalPrice.toLocaleString("vi-VN"), // Thêm giá gốc đã tính
        };
      });
  };

  if (loading) return <FishSpinner />;

  const handleCreateOrder = async (id) => {
    try {
      setIsProcessing(true);
      const response = await createOrderConsignment(id);
      if (response.statusCode === 201) {
        navigate("/");

        // Tải lại danh sách ký gửi để cập nhật trạng thái
        await fetchConsignments();

        toast.success("Tạo đơn hàng thành công!");
      } else {
        throw new Error("Tạo đơn hàng thất bại");
      }
    } catch (error) {
      console.error("Create order error:", error);
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewProductDetail = async (productItemId) => {
    try {
      const response = await getProdItemById(productItemId);
      if (response.statusCode === 200) {
        setSelectedProduct(response.data);
        setShowProductDetail(true);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Không thể tải thông tin sản phẩm");
    }
  };

  const ProductDetailView = ({ product, onClose }) => {
    if (!product) return null;

    return (
      <div className="product-detail-overlay">
        <div className="product-detail-container">
          <div className="detail-header">
            <h2>Chi tiết sản phẩm</h2>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="product-detail-content">
            <div className="product-image-section">
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="product-info-section">
              <h3>{product.name}</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Giá:</span>
                  <span className="value">
                    {product.price?.toLocaleString("vi-VN")} VND
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Xuất xứ:</span>
                  <span className="value">{product.origin}</span>
                </div>
                <div className="info-item">
                  <span className="label">Giới tính:</span>
                  <span className="value">{product.sex}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tuổi:</span>
                  <span className="value">{product.age} tháng</span>
                </div>
                <div className="info-item">
                  <span className="label">Kích thước:</span>
                  <span className="value">{product.size}</span>
                </div>
                <div className="info-item">
                  <span className="label">Loài:</span>
                  <span className="value">{product.species}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tính cách:</span>
                  <span className="value">{product.personality}</span>
                </div>
                <div className="info-item">
                  <span className="label">Lượng thức ăn:</span>
                  <span className="value">{product.foodAmount}</span>
                </div>
                <div className="info-item">
                  <span className="label">Nhiệt độ nước:</span>
                  <span className="value">{product.waterTemp}°C</span>
                </div>
                <div className="info-item">
                  <span className="label">Độ cứng nước:</span>
                  <span className="value">{product.mineralContent}</span>
                </div>
                <div className="info-item">
                  <span className="label">Độ pH:</span>
                  <span className="value">{product.ph}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  ProductDetailView.propTypes = {
    product: PropTypes.shape({
      imageUrl: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      origin: PropTypes.string,
      sex: PropTypes.string,
      age: PropTypes.number,
      size: PropTypes.string,
      species: PropTypes.string,
      personality: PropTypes.string,
      foodAmount: PropTypes.string,
      waterTemp: PropTypes.string,
      mineralContent: PropTypes.string,
      ph: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
  };

  return (
    <div className="uc-container">
      <div className="back-arrow">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>

      <main className="uc-content animated user-select-none">
        <div className="uc-header">
          <h1 className="uc-title">Quản lý cá ký gửi</h1>
        </div>

        <div className="uc-table-container">
          <div className="uc-tabs">
            <button
              className={`uc-tab-button ${statusTab === "Pending" ? "active" : ""
                }`}
              onClick={() => setStatusTab("Pending")}
            >
              <i className="fas fa-clock me-2"></i>
              Đang chờ
              <span className="uc-count">
                {getConsignmentCountByStatus("Pending")}
              </span>
            </button>
            <button
              className={`uc-tab-button ${statusTab === "Approved" ? "active" : ""
                }`}
              onClick={() => setStatusTab("Approved")}
            >
              <i className="fas fa-check me-2"></i>
              Đã duyệt
              <span className="uc-count">
                {getConsignmentCountByStatus("Approved")}
              </span>
            </button>
            <button
              className={`uc-tab-button ${statusTab === "Checkedout" ? "active" : ""
                }`}
              onClick={() => setStatusTab("Checkedout")}
            >
              <i className="fas fa-box-open me-2"></i>
              Đã thanh toán
              <span className="uc-count">
                {getConsignmentCountByStatus("Checkedout")}
              </span>
            </button>
            <button
              className={`uc-tab-button ${statusTab === "Cancelled" ? "active" : ""
                }`}
              onClick={() => setStatusTab("Cancelled")}
            >
              <i className="fas fa-ban me-2"></i>
              Đã huỷ
              <span className="uc-count">
                {getConsignmentCountByStatus("Cancelled")}
              </span>
            </button>
          </div>

          <table className="uc-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên cá</th>
                <th>Giá Bán/Phí Chăm Sóc</th>

                <th>Ngày tạo đơn</th>
                <th>Loại ký gửi</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filterConsignmentsByStatus(statusTab)?.map((consignment) => (
                <tr key={`${consignment.consignmentItemId}`}>
                  <td>
                    <img
                      src={consignment.imageUrl}
                      alt={consignment.productItemName}
                      className="consignment-thumbnail"
                    />
                  </td>
                  <td>
                    <div className="product-name-container">
                      <span>{consignment.productItemName}</span>
                      <button
                        className="btn btn-outline-info btn-sm ms-2"
                        onClick={() =>
                          handleViewProductDetail(consignment.productItemId)
                        }
                      >
                        <i className="fas fa-info-circle"></i> Chi tiết
                      </button>
                    </div>
                  </td>
                  <td>
                    {consignment.category === "Cá Gửi Bán"
                      ? consignment.originalPrice // Hiển thị giá gốc
                      : consignment.fee.toLocaleString("vi-VN")}{" "}
                    VND
                  </td>

                  <td>
                    {new Date(consignment.createdTime).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </td>
                  <td>{consignment.category}</td>
                  <td>
                    <span
                      className={`uc-status ${consignment.consignmentItemStatus.toLowerCase()}`}
                    >
                      {consignment.consignmentItemStatus}
                    </span>
                  </td>
                  <td>
                    {consignment.category !== "Cá Gửi Bán" &&
                      !["Pending", "Checkedout", "Cancelled"].includes(
                        consignment.consignmentItemStatus
                      ) && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCreateOrder(consignment.productItemId)}
                          disabled={isProcessing}
                        >
                          Thanh Toán
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmCancelItem}
      />

      {showProductDetail && (
        <ProductDetailView
          product={selectedProduct}
          onClose={() => {
            setShowProductDetail(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default UserConsignment;
