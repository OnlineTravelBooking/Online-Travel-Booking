import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LoginScreen from "./component/LoginScreen";
import Home from "./component/HomePage/Home";
import Detail from "./component/DetailPage/Detail";
import Transaction from "./component/Transactionpage/Transaction";
import EditTourList from "./component/AdminPage/EditTourList";
import AddPackage from "./component/AdminPage/CreatePackage";
import StatusPage from "./component/HomePage/StatusPage";
import ApprovePage from "./component/AdminPage/ApprovePage";
import CreatePackage from "./component/AdminPage/CreatePackage";
import VerifyPage from "./component/AdminPage/VerifyPage";
import RegisterForm from "./component/RegisterForm";

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
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin/create-package" element={isAuthorized("admin") ? <CreatePackage /> : <Navigate to="/" />} />
        <Route path="/edit-tour-list" element={isAuthorized("admin") ? <EditTourList /> : <Navigate to="/" />} />
        <Route path="/add-package" element={isAuthorized("admin") ? <AddPackage /> : <Navigate to="/" />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/admin/approve" element={<ApprovePage />} />
        <Route path="/admin/verify" element={<VerifyPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
