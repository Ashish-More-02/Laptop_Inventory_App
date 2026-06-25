import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// import pages here
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { LaptopDataProvider } from "./context/LaptopDataContext";

function App() {
  return (
    <AuthProvider>
      <div className="">
        <Routes>
          {/* public routes  */}
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>

          {/* private routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}></Route>
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
