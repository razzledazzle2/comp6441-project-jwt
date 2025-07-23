import { Box, Input, Button, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password || !confirmPassword) {
      setErrorMessage("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Registration failed");
      } else {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Redirect to login after 1 seconds
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Server error. Please try again.");
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
        Register
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
        <Input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {successMessage && (
          <Typography sx={{ color: "green", marginBottom: "10px" }}>
            {successMessage}
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
          {loading ? "Registering..." : "Register"}
        </Button>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", marginTop: "15px", color: "black" }}
        >
          <Link to="/login" style={{ color: "blue" }}>
            Already have an account? Login
          </Link>
        </Typography>
      </form>
    </Box>
  );
};
