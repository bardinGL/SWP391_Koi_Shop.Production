/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signin } from "../../services/UserService";
import { UserContext } from "../../contexts/UserContext";
import "./Login.css";
import "../../styles/animation.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "../../components/GoogleLogin";
import FishSpinner from "../../components/FishSpinner";

const Login = () => {
  const navigate = useNavigate();
  const { loginContext } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!(email && password)) {
      toast.error("Email và mật khẩu không được để trống!");
      return;
    }

    setIsLoading(true);
    try {
      let res = await signin(email.trim(), password.trim());

      if (res && res.data.token) {
        const { email } = res.data.user;
        loginContext(email, res.data.token);

        if (email === "staff@gmail.com" || email === "manager@gmail.com") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }

        toast.success("Đăng nhập thành công!");
      } else {
        toast.error("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error
        switch (error.response.status) {
          case 401:
            toast.error("Email hoặc mật khẩu không chính xác!");
            break;
          case 403:
            toast.error("Tài khoản của bạn đã bị khóa!");
            break;
          case 404:
            toast.error("Tài khoản không tồn tại!");
            break;
          default:
            toast.error("Đăng nhập thất bại! Vui lòng thử lại sau.");
        }
      } else if (error.request) {
        // No response received
        toast.error("Không thể kết nối đến máy chủ!");
      } else {
        // Other errors
        toast.error("Đã xảy ra lỗi! Vui lòng thử lại sau.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter" && email && password) {
      handleLogin();
    }
  };

  return (
    <GoogleOAuthProvider clientId="684900073655-mu5vsdorjg8j82vkcf9uiuu7conm57fh.apps.googleusercontent.com">
      {isLoading && <FishSpinner />}
      <div className="login-container">
        <div className="back-arrow">
          <i
            className="fa-solid fa-arrow-left"
            onClick={() => navigate(-1)}
          ></i>
        </div>
        <main className="login-content animated user-select-none">
          <div className="login-form">
            <div className="login-title">
              <h2>Đăng nhập</h2>
              <p>Chào mừng bạn quay trở lại!</p>
            </div>

            <div className="login-input">
              <div>
                <label>Email</label>
                <input
                  type="text"
                  placeholder="Vui lòng nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(event) => handlePressEnter(event)}
                />
              </div>
              <div className="password-input-container">
                <label>Mật khẩu</label>
                <input
                  type={isShowPassword ? "password" : "text"}
                  placeholder="Vui lòng nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handlePressEnter}
                />
                <i
                  style={{
                    position: "absolute",
                    marginTop: "14px",
                  }}
                  className={
                    isShowPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                  }
                  onClick={() => setIsShowPassword(!isShowPassword)}
                ></i>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  className={`${email && password ? "" : "empty"} login-button`}
                  disabled={!(email && password)}
                  onClick={() => handleLogin()}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </div>

              <div className="link-button-wrapper-login">
                <div className="">
                  <p>
                    <span>Chưa có tài khoản?</span>
                    <a
                      className="primary cursor-pointer"
                      onClick={() => {
                        navigate("/register");
                      }}
                    >
                      Đăng Ký Ngay
                    </a>
                  </p>
                </div>
                <p>
                  <a
                    className="cursor-pointer"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Quên mật khẩu
                  </a>
                </p>
              </div>
              <GoogleLoginButton />
            </div>
          </div>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
