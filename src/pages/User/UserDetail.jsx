import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { updateUserInfo, getUserInfo } from "../../services/UserService";
import {
  getOrderByUser,
  updateIsDelivered,
  cancelOrder,
} from "../../services/OrderService";
import { fetchAllPayment, processRefund } from "../../services/PaymentService";
import {
  getNameOfProdItem,
  getProdItemById,
} from "../../services/ProductItemService";
import "./UserDetail.css";
import FishSpinner from "../../components/FishSpinner";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import HintBox from "../../components/HintBox";
import { createPayment } from "../../services/PaymentService";
import { fetchBatchById } from "../../services/BatchService";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: user.email || "",
    password: "",
    address: "",
    phone: "",
  });

  const [activeTab, setActiveTab] = useState("Pending");

  const isPaymentPage = window.location.pathname.includes("/payments");

  const [productNames, setProductNames] = useState({});

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderIdToCancel, setOrderIdToCancel] = useState(null);

  const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false);

  const [showCheckoutHint, setShowCheckoutHint] = useState(false);

  const [batchDetails, setBatchDetails] = useState({});
  const [expandedRows, setExpandedRows] = useState([]);
  console.log("🚀 ~ UserDetail ~ expandedRows:", expandedRows);

  const toggleExpandedRow = (orderId) => {
    setExpandedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const renderExpandedRow = (order) => (
    <tr>
      <td colSpan="8">
        <div className="ao-expanded-content">
          {/* Danh sách sản phẩm */}
          <div className="ao-products-section">
            <div className="ao-section-title">Chi tiết sản phẩm</div>

            {order.items.map((item, index) => (
              <div key={index} className="ao-product-item">
                <div className="ao-single-item">
                  <div className="ao-single-content">
                    <img
                      src={item.data.imageUrl || "/default-product.png"}
                      alt={item.data.name}
                      className="ao-item-image"
                      onError={(e) => {
                        e.target.src = "/default-product.png";
                        e.target.onerror = null;
                      }}
                    />

                    <div className="ao-item-info">
                      <div className="ao-item-name">{item.data.name}</div>
                      <div className="ao-item-specs">
                        <div className="ao-item-spec">
                          <span className="ao-spec-label">Giới tính:</span>
                          <span className="ao-spec-value">{item.data.sex}</span>
                        </div>
                        <div className="ao-item-spec">
                          <span className="ao-spec-label">Tuổi:</span>
                          <span className="ao-spec-value">{item.data.age}</span>
                        </div>
                        <div className="ao-item-spec">
                          <span className="ao-spec-label">Size:</span>
                          <span className="ao-spec-value">
                            {item.data.size}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ao-item-purchase">
                      <span className="ao-purchase-quantity">
                        Số lượng: {item.data.quantity}
                      </span>
                      <span className="ao-purchase-price">
                        {item.data.price?.toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng cộng */}
          <div className="ao-order-total">
            <span className="ao-total-label">Tổng tiền:</span>
            <span className="ao-total-value">
              {order.total.toLocaleString("vi-VN")} VND
            </span>
          </div>
        </div>
      </td>
    </tr>
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setShowCheckoutHint(searchParams.get("fromCart") === "true");
  }, []);

  useEffect(() => {
    if (!user.auth) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
  }, [user, navigate]);

  const filterOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };
  console.log("🚀 ~ filterOrdersByStatus ~ orders:", orders);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userInfoResponse = await getUserInfo();
        const userData = userInfoResponse.data;

        setUpdatedUser({
          name: userData?.name || "",
          email: userData?.email || "",
          address: userData?.address || "",
          phone: userData?.phone || "",
          password: "",
        });

        if (isPaymentPage) {
          const paymentsResponse = await fetchAllPayment();
          setPayments(paymentsResponse.data?.data || []);
        } else {
          const paymentsResponse = await fetchAllPayment();
          setPayments(
            paymentsResponse?.data?.data || paymentsResponse?.data || []
          );
          const ordersResponse = await getOrderByUser();
          const allOrders = Array.isArray(ordersResponse.data)
            ? ordersResponse.data
            : [];

          const sortedOrders = allOrders.sort(
            (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
          );

          const nonConsignmentOrders = sortedOrders.filter(
            (order) => !order.consignmentId
          );

          for (const order of nonConsignmentOrders) {
            for (const item of order.items) {
              const data = await getProdItemById(item.productItemId);
              item.data = data.data;
            }
          }

          setOrders(nonConsignmentOrders);

          const uniqueProductItemIds = [
            ...new Set(
              nonConsignmentOrders.flatMap((order) =>
                order.items.map((item) => item.productItemId)
              )
            ),
          ];

          const namesPromises = uniqueProductItemIds.map((id) =>
            getNameOfProdItem(id)
          );
          const namesResponses = await Promise.all(namesPromises);
          const names = {};
          namesResponses.forEach((response) => {
            if (response && response.id) {
              names[response.id] = response.name || "Unknown Product";
            }
          });

          // Fetch batch details for items with batchId
          const uniqueBatchIds = [
            ...new Set(
              nonConsignmentOrders.flatMap((order) =>
                order.items
                  .filter((item) => item.batchId)
                  .map((item) => item.batchId)
              )
            ),
          ];

          const batchDetailPromises = uniqueBatchIds.map((id) =>
            fetchBatchById(id)
          );
          const batchDetailsResponses = await Promise.all(batchDetailPromises);

          const batchDetails = {};
          batchDetailsResponses.forEach((response) => {
            if (response?.data?.id) {
              batchDetails[response.data.id] = response.data;
            }
          });

          setProductNames(names);
          setBatchDetails(batchDetails);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (user.auth) {
      fetchData();
    }
  }, [user, isPaymentPage]);

  const handleNavigateToPayments = () => {
    navigate(`/${id}/payments`);
  };

  const handleNavigateToOrders = () => {
    navigate(`/${id}/detail`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUser = {
      ...updatedUser,
      name: updatedUser.name?.trim(),
      email: updatedUser.email?.trim(),
      address: updatedUser.address?.trim(),
      phone: updatedUser.phone?.replace(/\s+/g, ""),
      password: updatedUser.password,
    };

    setUpdatedUser(trimmedUser);
    setIsEditConfirmModalOpen(true);
  };

  const confirmUpdate = async () => {
    try {
      if (String(updatedUser.password) !== "123456") {
        toast.error("Mật khẩu không chính xác!");
        return;
      }

      const response = await updateUserInfo(updatedUser);
      if (response.statusCode === 200) {
        setUpdatedUser((prev) => ({
          ...prev,
          ...response.data?.data,
          password: "",
        }));
        setEditMode(false);
        toast.success("Cập nhật thông tin thành công!");

        // Redirect to cart if coming from cart page and has address/phone
        const searchParams = new URLSearchParams(window.location.search);
        if (
          searchParams.get("fromCart") === "true" &&
          updatedUser.address?.trim() &&
          updatedUser.phone?.trim()
        ) {
          navigate("/cart");
        }
      }
    } catch (err) {
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsEditConfirmModalOpen(false);
    }
  };

  const handleUpdateIsDelivered = async (orderId) => {
    try {
      await updateIsDelivered(orderId);
      const updatedOrders = orders.map((order) =>
        order.orderId === orderId ? { ...order, isDelivered: true } : order
      );
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Error updating isDelivered:", err);
      setError("Failed to update order. Please try again.");
    }
  };

  const handleBackClick = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      navigate(-1);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setOrderIdToCancel(orderId);
    setIsConfirmModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    try {
      const response = await cancelOrder(orderIdToCancel);

      if (response.statusCode === 200) {
        const updatedOrders = orders.map((order) =>
          order.orderId === orderIdToCancel
            ? { ...order, status: "Cancelled" }
            : order
        );
        setOrders(updatedOrders);
        setError(null);
        toast.success(
          "Bạn đã huỷ đơn hàng thành công, tiền sẽ được chuyển lại vào tài khoản của khách hàng trễ nhất 48 giờ."
        );

        const paymentResponse = await fetchAllPayment();
        if (paymentResponse.statusCode === 200 && paymentResponse.data) {
          const payments = paymentResponse.data;

          const payment = payments.find((p) => p.orderId === orderIdToCancel);
          if (payment) {
            const refundResponse = await processRefund(payment.id);
            if (refundResponse.statusCode === 200) {
              toast.success("Refund has been processed successfully.");
            } else {
              toast.error("Failed to process refund. Please try again.");
            }
          }
        } else {
          // toast.error("Failed to fetch payments for processing the refund.");
        }
      } else {
        setError(
          "Unexpected response when cancelling order. Please try again."
        );
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Failed to cancel order. Please try again.");
    } finally {
      setIsConfirmModalOpen(false);
      setOrderIdToCancel(null);
    }
  };

  const handleBuyAgain = async (orderId) => {
    try {
      // Create the payment URL using the failed order's ID
      const paymentResponse = await createPayment({
        orderDescription: "Thanh toán lại đơn hàng thất bại",
        orderType: "billpayment",
        name: "Your Name", // Optionally customize with user name
        orderId: orderId, // Use the existing failed order's ID
      });

      // Redirect to the generated payment URL
      if (paymentResponse && paymentResponse.data) {
        window.location.href = paymentResponse.data;
      } else {
        toast.error("Không thể tạo URL thanh toán.");
      }
    } catch (error) {
      console.error("Error creating payment URL:", error);
      toast.error("Lỗi tạo URL thanh toán.");
    }
  };

  const isOrderPaid = (orderId) => {
    return (
      Array.isArray(payments) &&
      payments.some((payment) => payment?.orderId === orderId)
    );
  };

  if (!user.auth) {
    return (
      <div className="user-detail-container">
        Vui lòng đăng nhập để xem thông tin.
      </div>
    );
  }

  if (loading) {
    return <FishSpinner />;
  }

  if (error) {
    return <div className="user-detail-container error-message">{error}</div>;
  }

  return (
    <div className="user-detail-container">
      <div className="back-arrow">
        <i className="fa-solid fa-arrow-left" onClick={handleBackClick}></i>
      </div>

      <main className="user-detail-content animated user-select-none">
        <div className="user-detail-header">
          <h1 className="user-detail-title">
            {isPaymentPage ? "Lịch sử thanh toán" : "Thông tin người dùng"}
          </h1>

          <div
            onClick={
              isPaymentPage ? handleNavigateToOrders : handleNavigateToPayments
            }
            className="text-uppercase btn"
          >
            {isPaymentPage ? (
              <>
                Xem thông tin người dùng
                <i className="fa-solid fa-user px-2"></i>
              </>
            ) : (
              <div className="btn-view-payments">
                Lịch sử thanh toán
                <i className="fa-solid fa-clock-rotate-left px-2"></i>
              </div>
            )}
          </div>
        </div>

        {showCheckoutHint && (
          <HintBox
            message="Vui lòng cập nhật địa chỉ và số điện thoại để tiếp tục thanh toán (Đối với đăng nhập bằng email, mật khẩu mặc định là 123456)"
            type="warning"
          />
        )}

        {!isPaymentPage && (
          <div className="user-detail-info">
            {editMode ? (
              <form onSubmit={handleSubmit} className="edit-form">
                <div>
                  <label htmlFor="name">Tên:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={updatedUser.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="address">Địa chỉ:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={updatedUser.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="phone">Số điện thoại:</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={updatedUser.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="password">
                    Mật khẩu xác thực (Bắt Buộc):
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={updatedUser.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit">Lưu thay đổi</button>
                <button type="button" onClick={() => setEditMode(false)}>
                  Hủy
                </button>
              </form>
            ) : (
              <>
                <div className="user-info-grid">
                  <div className="user-info-row">
                    <div className="user-info-item">
                      <strong>Email:</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="user-info-item">
                      <strong>Địa chỉ:</strong>
                      <span>{updatedUser.address || "Chưa cung cấp"}</span>
                    </div>
                  </div>
                  <div className="user-info-row">
                    <div className="user-info-item">
                      <strong>Tên:</strong>
                      <span>{updatedUser.name || "Chưa cung cấp"}</span>
                    </div>
                    <div className="user-info-item">
                      <strong>Số điện thoại:</strong>
                      <span>{updatedUser.phone || "Chưa cung cấp"}</span>
                    </div>
                    <div className="user-info-item">
                      <strong>Trạng thái:</strong>
                      <div
                        className={`user-auth-badge ${
                          user.auth ? "verified" : "unverified"
                        }`}
                      >
                        {user.auth ? "Đã xác thực" : "Chưa xác thực"}
                      </div>
                    </div>
                    <button
                      className="edit-info-btn"
                      onClick={() => setEditMode(true)}
                    >
                      <i className="fa-solid fa-wrench"></i>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {isPaymentPage ? (
          <>
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Mã thanh toán</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                  <th>Ngày thanh toán</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <>
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.amount.toLocaleString("vi-VN")} VND</td>
                      <td>{payment.paymentMethod}</td>
                      <td>
                        {new Date(payment.paymentDate).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                      <td>{payment.status}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleNavigateToOrders}
              className="btn btn-primary"
            >
              Xem thông tin người dùng
            </button>
          </>
        ) : (
          <>
            <div className="user-detail-header">
              <h2 className="user-detail-title">Đơn hàng của bạn</h2>
            </div>
            {orders.length === 0 ? (
              <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
              <>
                <div className="order-tabs">
                  <button
                    className={`order-tab-button ${
                      activeTab === "Pending" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Pending")}
                  >
                    Đang xử lý
                  </button>
                  <button
                    className={`order-tab-button ${
                      activeTab === "Delivering" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Delivering")}
                  >
                    Đang giao hàng
                  </button>
                  <button
                    className={`order-tab-button ${
                      activeTab === "Completed" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Completed")}
                  >
                    Đã hoàn thành
                  </button>
                  <button
                    className={`order-tab-button ${
                      activeTab === "Cancelled" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Cancelled")}
                  >
                    Đã hủy
                  </button>
                  <button
                    className={`order-tab-button ${
                      activeTab === "Failed" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("Failed")}
                  >
                    Thất bại
                  </button>
                </div>

                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Chi tiết đơn hàng</th>
                      <th>Mã Đơn Hàng</th>
                      {/* <th>Sản Phẩm</th> */}
                      <th>Tổng Tiền</th>
                      <th>Ngày Mua</th>
                      {["Pending", "Delivering"].includes(activeTab) && (
                        <th>Hình thức</th>
                      )}
                      <th>Trạng Thái</th>
                      <th>Tình trạng thanh toán</th>
                      {activeTab === "Completed" && <th>Xác Nhận Hàng</th>}
                      {(activeTab === "Pending" || activeTab === "Failed") && (
                        <th>Hủy Đơn Hàng</th>
                      )}
                      {activeTab === "Failed" && <th>Mua lại</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filterOrdersByStatus(activeTab).map((order) => (
                      <>
                        <tr key={order.orderId}>
                          <td>
                            <button
                              title="Xem chi tiết"
                              className="btn btn-sm mr-2"
                              onClick={() => toggleExpandedRow(order.orderId)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <span>Chi tiết</span>
                                <i className="fas fa-info-circle"></i>
                              </div>
                            </button>
                          </td>
                          <td>{order.orderId.slice(0, 5)}</td>

                          {/* <td>
                          {(() => {
                            // Group items by batchId
                            const groupedItems = order.items.reduce(
                              (acc, item) => {
                                if (item.batchId) {
                                  if (!acc[item.batchId]) {
                                    acc[item.batchId] = {
                                      batchId: item.batchId,
                                      items: [],
                                    };
                                  }
                                  acc[item.batchId].items.push(item);
                                } else {
                                  acc[item.productItemId] = {
                                    ...item,
                                    isIndividual: true,
                                  };
                                }
                                return acc;
                              },
                              {}
                            );

                            console.log("groupedItems", groupedItems);

                            return Object.values(groupedItems).map(
                              (group, index) =>
                                group.isIndividual ? (
                                  // Individual item
                                  <div key={`${group.productItemId}-${index}`}>
                                    {productNames[group.productItemId] ||
                                      `Product ${group.productItemId}`}{" "}
                                    x {group.quantity}
                                  </div>
                                ) : (
                                  // Batch group
                                  <div key={`batch-${group.batchId}-${index}`}>
                                    <strong>
                                      {batchDetails[group.batchId]?.name ||
                                        `Batch ${group.batchId}`}
                                    </strong>
                                    <ul>
                                      {batchDetails[group.batchId]?.items.map(
                                        (batchItem, idx) => (
                                          <li
                                            key={`${batchItem.batchItemId}-${idx}`}
                                          >
                                            {batchItem.name}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )
                            );
                          })()}
                        </td> */}

                          <td>{order.total.toLocaleString("vi-VN")} VND</td>
                          <td>
                            {new Date(order.createdTime).toLocaleDateString(
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
                          {["Pending", "Delivering"].includes(activeTab) && (
                            <td>
                              {isOrderPaid(order.orderId) ? "VNPAY" : "COD"}
                            </td>
                          )}
                          <td>
                            <span
                              className={`user-order-badge ${order.status.toLowerCase()}`}
                            >
                              {order.status === "Pending" && "Chờ xử lý"}
                              {order.status === "Delivering" && "Đang giao"}
                              {order.status === "Completed" && "Hoàn thành"}
                              {order.status === "Cancelled" && "Đã hủy"}
                              {order.status === "Failed" && "Thất bại"}
                            </span>
                          </td>
                          <td>
                            {isOrderPaid(order.orderId) ? (
                              <span style={{ color: "green" }}>✓</span>
                            ) : (
                              <span style={{ color: "red" }}>✕</span>
                            )}
                          </td>
                          {activeTab === "Completed" && (
                            <td>
                              {order.isDelivered === null ? (
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    handleUpdateIsDelivered(order.orderId)
                                  }
                                >
                                  Xác nhận đã nhận hàng
                                </button>
                              ) : (
                                <span
                                  style={{ color: "green", fontWeight: "bold" }}
                                >
                                  ✓ Đã nhận hàng
                                </span>
                              )}
                            </td>
                          )}
                          {(activeTab === "Pending" ||
                            activeTab === "Failed") && (
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleCancelOrder(order.orderId)}
                              >
                                Hủy đơn hàng
                              </button>
                            </td>
                          )}
                          {activeTab === "Failed" && (
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => handleBuyAgain(order.orderId)}
                              >
                                Mua lại
                              </button>
                            </td>
                          )}
                        </tr>
                        {expandedRows.includes(order.orderId) &&
                          renderExpandedRow(order)}
                      </>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </main>
      <ConfirmationModal
        isOpen={isEditConfirmModalOpen}
        onClose={() => setIsEditConfirmModalOpen(false)}
        onConfirm={confirmUpdate}
        message="Bạn có chắc chắn muốn cập nhật thông tin?"
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmCancelOrder}
        message="Bạn có chắc chắn muốn hủy đơn hàng này không?"
      />
    </div>
  );
};

export default UserDetail;
