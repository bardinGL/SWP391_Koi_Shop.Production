import { Bounce, ToastContainer } from "react-toastify";
//import Header from "./components/Header"; // Assume you have a Header component
import AppRoutes from "./routes/AppRoutes";
import "./styles/App.css";

function App() {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Banner Section */}
      <div className="banner-container">
        <img
          src="/assets/banner.png"
          alt="Banner"
          className="banner-image"
        />
      </div>

      {/* Main Content */}
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
