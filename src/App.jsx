import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./styles/global.css";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OperatorDashboard from "./pages/operator/OperatorDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  return (
    <Router>
      <Routes>
        {/* login */}
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />

        {/* admin */}
        <Route
          path="/admin/*"
          element={token && role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* operator */}
        <Route
          path="/operator/*"
          element={token && role === "OPERATOR" ? <OperatorDashboard /> : <Navigate to="/login" />}
        />

        {/* manager */}
        <Route
          path="/manager/*"
          element={token && role === "MANAGER" ? <ManagerDashboard /> : <Navigate to="/login" />}
        />

        {/* default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
