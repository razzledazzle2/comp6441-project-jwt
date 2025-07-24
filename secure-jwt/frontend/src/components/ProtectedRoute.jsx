"use client";

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../utils/auth";

export const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAndCheckAuth();
  }, []);

  const initializeAndCheckAuth = async () => {
    try {
      // First, try to get a fresh access token using refresh token
      if (!authService.isAuthenticated()) {
        await authService.initializeAuth();
      }

      // Then check if we can access protected resources
      const response = await authService.apiCall("http://localhost:4000/me");

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
