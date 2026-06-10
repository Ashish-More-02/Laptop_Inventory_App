import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

// import pages here
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
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
  );
}

export default App;
