/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup } from "../../services/UserService";
// import { UserContext } from "../../contexts/UserContext";
import "./Register.css";
import "../../styles/animation.css";
import FishSpinner from "../../components/FishSpinner";

const Register = () => {
  // const { loginContext } = useContext(UserContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    Email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    Email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^0\d{9,10}$/;
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "Email":
        if (!emailRegex.test(value)) {
          error = "Email không hợp lệ";
        }
        break;
      case "phone":
        if (!phoneRegex.test(value)) {
          error = "Số điện thoại phải bắt đầu bằng 0 và có 10-11 số";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Mật khẩu không khớp";
        }
        break;
      default:
        if (!value.trim()) {
          error = "Trường này không được để trống";
        }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    // Special case for confirmPassword
    if (name === "password" && formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField(
          "confirmPassword",
          formData.confirmPassword
        ),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    // Phone validation
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error(
        "Số điện thoại không hợp lệ! Số điện thoại phải bắt đầu bằng 0 và có 10 hoặc 11 chữ số."
      );
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        name: formData.firstName + " " + formData.lastName,
        password: formData.password,
        email: formData.Email,
        phone: formData.phone,
        address: formData.address,
        roleId: 0,
      };

      let res = await signup(requestData);

      if (res.statusCode === 200) {
        navigate("/");
        toast.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      } else {
        toast.error(res.data.messageError);
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error("Thông tin không hợp lệ!");
            break;
          case 409:
            toast.error("Email đã được sử dụng!");
            break;
          default:
            toast.error("Đăng ký thất bại! Vui lòng thử lại sau.");
        }
      } else if (error.request) {
        toast.error("Không thể kết nối đến máy chủ!");
      } else {
        toast.error("Đã xảy ra lỗi! Vui lòng thử lại sau.");
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e, currentInputs) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^0\d{9,10}$/;

      const emptyField = currentInputs.find((field) => !formData[field].trim());

      if (emptyField) {
        document.querySelector(`input[name="${emptyField}"]`).focus();
        return;
      }

      if (currentInputs.includes("Email") && !emailRegex.test(formData.Email)) {
        toast.error("Email không hợp lệ!");
        return;
      }

      if (currentInputs.includes("phone") && !phoneRegex.test(formData.phone)) {
        toast.error(
          "Số điện thoại không hợp lệ! Số điện thoại phải bắt đầu bằng 0 và có 10 hoặc 11 chữ số."
        );
        return;
      }

      if (step < 3) {
        handleNext();
      } else if (
        formData.lastName &&
        formData.firstName &&
        formData.Email &&
        formData.address &&
        formData.password &&
        formData.confirmPassword
      ) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="register-container">
      {isLoading && <FishSpinner />}
      <div className="back-arrow">
        <i className="fa-solid fa-arrow-left" onClick={() => navigate(-1)}></i>
      </div>
      <main className="register-content animated user-select-none">
        <div className="register-form">
          <div className="register-title">
            <h2>Register</h2>
            <p>Hãy điền thông tin cần thiết để tạo tài khoản.</p>
          </div>

          <div className="register-input">
            {step === 1 && (
              <form
                onKeyPress={(e) => handleKeyPress(e, ["lastName", "firstName"])}
              >
                <div>
                  <label>Họ</label>
                  <input
                    autoFocus={true}
                    type="text"
                    name="lastName"
                    placeholder="Vui lòng nhập họ"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.lastName ? "error" : ""}
                  />
                  <div style={{ marginTop: "20px" }}>
                    {errors.lastName && (
                      <span className="error-message">{errors.lastName}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label>Tên</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Vui lòng nhập tên"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.firstName ? "error" : ""}
                  />
                  <div style={{ marginTop: "20px" }}>
                    {errors.firstName && (
                      <span className="error-message">{errors.firstName}</span>
                    )}
                  </div>
                </div>
                <div className="link-button-wrapper">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="register-button"
                  >
                    Trở về
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="register-button"
                    disabled={!formData.lastName || !formData.firstName}
                  >
                    Tiếp theo
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form
                onKeyPress={(e) =>
                  handleKeyPress(e, ["Email", "phone", "address"])
                }
              >
                <div>
                  <label>Email</label>
                  <input
                    autoFocus={true}
                    type="text"
                    name="Email"
                    placeholder="Vui lòng nhập email"
                    value={formData.Email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.Email ? "error" : ""}
                  />
                  <div style={{ marginTop: "20px" }}>
                    {errors.Email && (
                      <span className="error-message">{errors.Email}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Vui lòng nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.phone ? "error" : ""}
                  />
                  <div style={{ marginTop: "20px" }}>
                    {errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Vui lòng nhập địa chỉ"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.address ? "error" : ""}
                  />
                  <div style={{ marginTop: "20px" }}>
                    {errors.address && (
                      <span className="error-message">{errors.address}</span>
                    )}
                  </div>
                </div>
                <div className="link-button-wrapper">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="register-button"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="register-button"
                    disabled={
                      !formData.Email || !formData.phone || !formData.address
                    }
                  >
                    Tiếp theo
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form
                onSubmit={handleSubmit}
                onKeyPress={(e) =>
                  handleKeyPress(e, ["password", "confirmPassword"])
                }
              >
                <div className="password-input-container">
                  <label>Mật khẩu</label>
                  <input
                    autoFocus={true}
                    type={isShowPassword ? "password" : "text"}
                    name="password"
                    placeholder="Vui lòng nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.password ? "error" : ""}
                  />
                  <div style={{ marginTop: "20px" }}>
                    {errors.password && (
                      <span className="error-message">{errors.password}</span>
                    )}
                  </div>
                  <i
                    style={{ marginTop: "15px" }}
                    className={
                      isShowPassword
                        ? "fa-solid fa-eye-slash"
                        : "fa-solid fa-eye"
                    }
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  ></i>
                </div>
                <div>
                  <label>Nhập lại mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Vui lòng nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <div style={{ marginTop: "20px" }}>
                    {errors.confirmPassword && (
                      <span className="error-message">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>
                <div className="link-button-wrapper">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="register-button"
                    disabled={isLoading}
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="register-button"
                    disabled={
                      isLoading ||
                      !(
                        formData.lastName &&
                        formData.firstName &&
                        formData.Email &&
                        formData.address &&
                        formData.password &&
                        formData.confirmPassword
                      )
                    }
                  >
                    {isLoading ? (
                      <div className="button-loading">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span style={{ marginLeft: "8px" }}>
                          Đang đăng ký...
                        </span>
                      </div>
                    ) : (
                      "Tạo tài khoản"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
