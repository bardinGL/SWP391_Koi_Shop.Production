import { Bounce, ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import "./styles/App.css";

function App() {
  return (
    <>
      {/* Header Section */}
      <div className="app-container">
        <AppRoutes />

        {/* Banner Section */}
        <div className="banner-container">
          <img
            src="/assets/banner.png"
            alt="Banner"
            className="banner-image"
          />
        </div>
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
