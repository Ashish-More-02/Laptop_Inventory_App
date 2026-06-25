import { Navigate, Outlet } from "react-router-dom";
import { LaptopDataProvider } from "../context/LaptopDataContext";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? (
    <LaptopDataProvider>
      <Outlet />
    </LaptopDataProvider>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
