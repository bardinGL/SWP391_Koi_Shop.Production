// import { useContext } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { verifyEmail } from "../../services/AuthService";
// import { signin } from "../../services/UserService";
// import { UserContext } from "../../contexts/UserContext";
// import { toast } from "react-toastify";
// import FishSpinner from "../../components/FishSpinner";
// import { useState, useEffect } from "react";
// const EmailVerification = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { loginContext } = useContext(UserContext);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         const token = searchParams.get("token");
//         const email = searchParams.get("email");

//         if (!token || !email) {
//           toast.error("Link xác thực không hợp lệ");
//           navigate("/login");
//           return;
//         }

//         // First verify the email
//         await verifyEmail({
//           title: "Email Verification",
//           receiveAddress: email,
//           content: token,
//         });

//         // Then automatically sign in the user
//         const loginRes = await signin(email, searchParams.get("password"));

//         if (loginRes && loginRes.data.token) {
//           loginContext(email, loginRes.data.token);
//           toast.success("Xác thực email thành công!");
//           navigate("/");
//         }
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Xác thực thất bại");
//         navigate("/login");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     verifyToken();
//   }, [navigate, searchParams, loginContext]);

//   if (isLoading) {
//     return <FishSpinner />;
//   }

//   return null;
// };

// export default EmailVerification;
