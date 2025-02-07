import React, {
  createContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
  useContext,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  //Check for existing token
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedRole = sessionStorage.getItem("role");
    if (token) {
      const fetchUserData = async () => {
        try {
        } catch (error) {
          localStorage.removeItem("token");
        }
        setIsLoading(false);
      };
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  //Login function
  const login = useCallback((userData, token, role) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role);
    setData(userData);
    setIsAuthenticated(true);
    setRole(role);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setData(null);
    setIsAuthenticated(false);
  }, []);

  // Memoize context value to prevent unneccessary re-renders
  const value = useMemo(
    () => ({
      data,
      isAuthenticated,
      isLoading,
      login,
      logout,
      role,
    }),
    [data, isAuthenticated, isLoading, login, logout]
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
