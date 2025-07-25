
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Casos from "./pages/Casos";
import Bajas from "./pages/Bajas";
import DashboardGeneral from "./pages/DashboardGeneral";
import DashboardCasos from "./pages/DashboardCasos";
import DashboardBajas from "./pages/DashboardBajas";
import Toast from "./components/Toast";
import UserSettings from "./components/UserSettings";
import { useState, useEffect } from "react";
import "./App.css";


function App() {
  const [toasts, setToasts] = useState([]); // { message, type, id }
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [color, setColor] = useState(() => localStorage.getItem("userColor") || "#3b82f6");

  // Toasts
  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Aplicar color y modo oscuro globalmente
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", color);
    document.documentElement.style.setProperty("--primary-light", color + "22");
    localStorage.setItem("userColor", color);
  }, [color]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <Router>
      <div className={theme === "dark" ? "dark-theme" : ""} style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: "280px", display: "flex", flexDirection: "column" }}>
          <Header theme={theme} setTheme={setTheme} />
          <main style={{ flex: 1, padding: "2rem", background: "var(--background)" }}>
            <Routes>
              <Route path="/" element={<Casos showToast={showToast} />} />
              <Route path="/bajas" element={<Bajas showToast={showToast} />} />
              <Route path="/dashboard/general" element={<DashboardGeneral showToast={showToast} />} />
              <Route path="/dashboard/casos" element={<DashboardCasos />} />
              <Route path="/dashboard/bajas" element={<DashboardBajas />} />
              <Route path="/usuario" element={<UserSettings setColor={setColor} color={color} />} />
            </Routes>
          </main>
        </div>
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 12 }}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              visible={true}
              onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;
