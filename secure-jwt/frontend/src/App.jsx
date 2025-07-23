import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Login } from "./components/LoginPage";
import { Register } from "./components/Register";
import { Home } from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
