import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Login } from "./components/LoginPage";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
