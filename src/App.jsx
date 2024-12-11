import { Bounce, ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import "./styles/App.css";

function App() {
  return (
    <>
      {/* Add the banner image */}
      <div className="banner-container">
        <img
          src="/assets/banner.png"
          alt="Banner"
          className="banner-image"
        />
      </div>

      {/* Main App Content */}
      <div className="app-container">
        <AppRoutes />
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        closeButton={false}
        transition={Bounce}
      />
    </>
  );
}

export default App;
