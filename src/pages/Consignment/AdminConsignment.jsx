import React, { useState, useEffect } from "react";
import AdminHeader from "../../layouts/header/AdminHeader";
import {
  fetchAllConsignments,
  updateConsignmentItemStatus,
} from "../../services/ConsignmentService";
import { getUserById } from "../../services/UserService";
import { toast } from "react-toastify";
import FishSpinner from "../../components/FishSpinner";
import "./AdminConsignment.css";
import ConfirmationModal from "../../components/ConfirmationModal";

const AdminConsignment = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");
  const [userNames, setUserNames] = useState({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToCancel, setItemToCancel] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchAllConsignments();

      if (!response.data || !Array.isArray(response.data)) {
        setConsignments([]);
        setUserNames({});
        setLoading(false);
        return;
      }

      const sortedConsignments = response.data.sort((a, b) => {
        const timeA = a.items[0]?.contractDate
          ? new Date(a.items[0].contractDate).getTime()
          : 0;
        const timeB = b.items[0]?.contractDate
          ? new Date(b.items[0].contractDate).getTime()
          : 0;
        return timeB - timeA;
      });

      setConsignments(sortedConsignments);

      const uniqueUserIds = [...new Set(response.data.map((c) => c.userId))];
      const userPromises = uniqueUserIds.map(async (userId) => {
        try {
          const userResponse = await getUserById(userId);
          return { userId, name: userResponse.data.name };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return { userId, name: "Unknown User" };
        }
      });

      const users = await Promise.all(userPromises);
      const userNameMap = users.reduce((acc, user) => {
        acc[user.userId] = user.name;
        return acc;
      }, {});

      setUserNames(userNameMap);
    } catch (error) {
      console.error("Error fetching consignments:", error);
      toast.error("Không thể tải danh sách ký gửi");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const response = await updateConsignmentItemStatus(itemId, newStatus);
      if (response.data) {
        setConsignments((prevConsignments) =>
          prevConsignments.map((consignment) => ({
            ...consignment,
            items: consignment.items.map((item) =>
              item.consignmentItemId === itemId
                ? { ...item, consignmentItemStatus: newStatus }
                : item
            ),
          }))
        );

        toast.success("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const filterConsignmentsByStatus = (status) => {
    if (!Array.isArray(consignments) || consignments.length === 0) {
      return [];
    }

    return consignments
      .map((consignment) => ({
        ...consignment,
        items: consignment.items.filter((item) => {
          const searchTermLower = searchTerm.toLowerCase();

          let statusMatch = false;
          switch (status) {
            case "Pending":
              statusMatch = item.consignmentItemStatus === "Pending";
              break;
            case "Approved":
              statusMatch = item.consignmentItemStatus === "Approved";
              break;
            case "CheckedOut":
              statusMatch = item.consignmentItemStatus === "CheckedOut";
              break;
            case "Cancelled":
              statusMatch = item.consignmentItemStatus === "Cancelled";
              break;
            default:
              statusMatch = false;
          }

          const searchMatch =
            searchTerm === "" ||
            consignment.consignmentId
              .toLowerCase()
              .includes(searchTermLower);

          return statusMatch && searchMatch;
        }),
      }))
      .filter((consignment) => consignment.items.length > 0);
  };

  const handleCancelItem = (itemId) => {
    setItemToCancel(itemId);
    setIsConfirmModalOpen(true);
  };

  const confirmCancelItem = async () => {
    if (!itemToCancel) return;

    try {
      const response = await updateConsignmentItemStatus(itemToCancel, "Cancelled");

      if (response.data) {
        setConsignments((prevConsignments) =>
          prevConsignments.map((consignment) => ({
            ...consignment,
            items: consignment.items.map((item) =>
              item.consignmentItemId === itemToCancel
                ? { ...item, consignmentItemStatus: "Cancelled" }
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

  if (loading) return <FishSpinner />;

  return (
    <>
      {/* <AdminHeader /> */}
      <div className="container">
        <div className="my-3">
          <b>Danh sách ký gửi:</b>
          <div className="col-12 col-sm-4 my-3">
            <input
              className="form-control search-input"
              placeholder="Tìm kiếm theo mã ký gửi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="consignment-tabs">
          <button
            className={`consignment-tab-button ${
              activeTab === "Pending" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Pending")}
          >
            Chờ duyệt
          </button>
          <button
            className={`consignment-tab-button ${
              activeTab === "Approved" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Approved")}
          >
            Đã duyệt
          </button>
          <button
            className={`consignment-tab-button ${
              activeTab === "CheckedOut" ? "active" : ""
            }`}
            onClick={() => setActiveTab("CheckedOut")}
          >
            Đã thanh toán
          </button>
          <button
            className={`consignment-tab-button ${
              activeTab === "Cancelled" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Cancelled")}
          >
            Đã huỷ
          </button>
        </div>

        <div className="container-fluid">
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Mã ký gửi</th>
                <th>Loại mặt hàng</th>
                <th>Người ký gửi</th>
                <th>Ngày ký gửi</th>
                <th>Trạng thái</th>
                {activeTab === "Pending" && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filterConsignmentsByStatus(activeTab).map((consignment) => (
                <React.Fragment key={consignment.consignmentId}>
                  {consignment.items.map((item) => (
                    <tr key={item.consignmentItemId}>
                      <td>{consignment.consignmentId}</td>
                      <td>{item.consignmentItemType || "Unknown"}</td>
                      <td>
                        {userNames[consignment.userId] || consignment.userId}
                      </td>
                      <td>
                        {item.contractDate
                          ? new Date(item.contractDate).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }
                            )
                          : "Không có dữ liệu"}
                      </td>
                      <td>
                        <span
                          className={`admin-consignment-status-badge ${item.consignmentItemStatus.toLowerCase()}`}
                        >
                          {item.consignmentItemStatus}
                        </span>
                      </td>
                      {activeTab === "Pending" && (
                        <td>
                          <button
                            title="Xác nhận ký gửi"
                            className="btn btn-success ms-2"
                            onClick={() =>
                              handleStatusChange(item.consignmentItemId, "Approved")
                            }
                          >
                            <i className="fa-solid fa-clipboard-check"></i>
                          </button>
                          <button
                            title="Huỷ đơn ký gửi"
                            className="btn btn-danger ms-2"
                            onClick={() => handleCancelItem(item.consignmentItemId)}
                          >
                            <i className="fa-solid fa-ban"></i>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              {filterConsignmentsByStatus(activeTab).length === 0 && (
                <>
                  <tr>
                    <td colSpan="6">Không tìm thấy ký gửi nào</td>
                  </tr>
                  <tr>
                    <td colSpan="6">
                      <i
                        className="fa-regular fa-folder-open"
                        style={{ fontSize: "30px", opacity: 0.2 }}
                      ></i>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmCancelItem}
        message="Bạn có chắc chắn muốn huỷ ký gửi này?"
      />
    </>
  );
};

export default AdminConsignment;