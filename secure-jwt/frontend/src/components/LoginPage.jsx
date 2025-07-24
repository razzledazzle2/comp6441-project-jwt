"use client";

import { Box, Input, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../utils/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Email cannot be blank");
      setLoading(false);
      return;
    }

    if (!password) {
      setErrorMessage("Password cannot be blank");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store access token in memory only
      authService.setAccessToken(data.accessToken);

      // Navigate to home page after successful login
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: "400px",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{ textAlign: "center", color: "black", marginBottom: "20px" }}
      >
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={{
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          sx={{
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        />
        {errorMessage && (
          <Typography sx={{ color: "red", marginBottom: "10px" }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ padding: "10px" }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", marginTop: "15px", color: "black" }}
        >
          <Link to="/register" style={{ color: "blue" }}>
            Don't have an account? Register
          </Link>
        </Typography>
      </form>
    </Box>
  );
};
