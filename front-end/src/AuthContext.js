import React, { createContext, useCallback, useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // ตรวจสอบ token และดึงข้อมูลผู้ใช้จาก sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedRole = sessionStorage.getItem("role");
    const storedUserData = sessionStorage.getItem("userData");

    if (token && storedUserData) {
      setData(JSON.parse(storedUserData)); // ดึงข้อมูลผู้ใช้จาก sessionStorage
      setRole(storedRole);
      setIsAuthenticated(true);
    }
    setIsLoading(false); // เปลี่ยนสถานะหลังจากตรวจสอบเสร็จ
  }, []);

  // ฟังก์ชันสำหรับ login
  const login = useCallback((userData, token, role) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role);
    setData(userData);
    setIsAuthenticated(true);
    setRole(role);
  }, []);

  // ฟังก์ชัน logout
  const logout = useCallback(() => {
    sessionStorage.clear();
    setData(null);
    setIsAuthenticated(false);
    setRole(null);
    navigate("/");
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      data,
      isAuthenticated,
      isLoading,
      login,
      logout,
      role,
    }),
    [data, isAuthenticated, isLoading, login, logout, role]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
