import { useState, useEffect } from "react";

const API = "http://localhost:4000";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState("");

  // Read query params (simulate redirect-based XSS)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const emailParam = query.get("email");
    const errorParam = query.get("error");
    if (emailParam) setEmail(emailParam);
    if (errorParam) setError(errorParam);
  }, []);

  const handleRegister = async () => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      window.location.href = "/dashboard";
    } else {
      // Simulate insecure redirect with reflected email + error
      const safeEmail = encodeURIComponent(email);
      const safeError = encodeURIComponent(data.error);
      window.location.href = `/?email=${safeEmail}&error=${safeError}`;
    }
  };
  if (window.location.pathname === "/dashboard") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Welcome!</h2>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Login / Register</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister} style={{ marginLeft: "10px" }}>
          Register
        </button>
      </div>

      {/* Reflected XSS vulnerability via error query param */}
      {error && (
        <div
          style={{
            marginTop: "30px",
            padding: "10px",
            border: "1px solid red",
            backgroundColor: "#ffeeee",
          }}
          dangerouslySetInnerHTML={{ __html: error }}
        />
      )}
    </div>
  );
}

export default App;

// localStorage.clear();
// localStorage.setItem("token", 123);
// http://localhost:5173/?error=<img src=x onerror="alert('XSS')">
// http://localhost:5173/?error=<img src onerror=alert(JSON.stringify(localStorage)) />

