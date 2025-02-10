import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LoginScreen from "./component/LoginScreen";
import Home from "./component/HomePage/Home";
import AdminDashboard from "./component/AdminPage/AdminDashboard";
import Detail from "./component/DetailPage/Detail";
import EditTourList from "./component/AdminPage/EditTourList";

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/admin"
          element={
            isAuthorized("admin") ? <AdminDashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/tour-list"
          element={
            isAuthorized("admin") ? <EditTourList /> : <Navigate to="/" />
          } />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

