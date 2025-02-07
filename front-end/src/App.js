import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LoginScreen from "./component/LoginScreen";
import Home from "./component/Home";
import AdminDashboard from "./component/AdminDashboard";
import React, { useEffect } from "react";

function App() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  const isAuthorized = (requiredType) => token && role === requiredType;

  useEffect(() => {
    if (location.pathname === "/admin" && !isAuthorized("admin")) {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
    }
  }, [location.pathname]);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/admin"
          element={
            isAuthorized("admin") ? <AdminDashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
