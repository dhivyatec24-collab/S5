import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, studentAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tnea_token");
    if (token) {
      authAPI
        .getCurrentUser()
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("tnea_token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem("tnea_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    localStorage.setItem("tnea_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("tnea_token");
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await studentAPI.getProfile();
      setUser((prev) => ({ ...prev, ...res.data.profile }));
      return res.data.profile;
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
