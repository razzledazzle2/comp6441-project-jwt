"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import { authService } from "../utils/auth";

export const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.apiCall("http://localhost:4000/me");

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });
      authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      authService.logout();
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <Paper
        sx={{
          padding: "30px",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "20px", color: "black" }}>
          Welcome Home!
        </Typography>

        {user && (
          <Typography variant="h6" sx={{ marginBottom: "20px", color: "gray" }}>
            Hello, {user.email}
          </Typography>
        )}

        <Typography
          variant="body1"
          sx={{ marginBottom: "30px", color: "black" }}
        >
          You are successfully logged in and authenticated.
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ padding: "10px 20px" }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
};
