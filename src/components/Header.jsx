
import React from "react";
import "./Header.css";

export default function Header({ theme, setTheme }) {
  return (
    <header className="main-header" role="banner">
      <div className="header-content">
        <span className="header-title" role="heading" aria-level="1">Gestión de Casos y Bajas</span>
        <span className="header-greeting">¡Bienvenido/a!</span>
        <button
          className="theme-switch"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={theme === "dark" ? "Cambiar a modo claro (fondo blanco)" : "Cambiar a modo oscuro (fondo oscuro)"}
          aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {theme === "dark" ? "🌙 Oscuro" : "☀️ Claro"}
        </button>
      </div>
    </header>
  );
}
