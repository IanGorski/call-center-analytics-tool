import { useState, useEffect } from "react";
import "./UserSettings.css";

const COLORS = [
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#22c55e" },
  { name: "Naranja", value: "#f59e42" },
  { name: "Rojo", value: "#ef4444" },
  { name: "Violeta", value: "#8b5cf6" }
];


export default function UserSettings({ setColor, color }) {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const savedNombre = localStorage.getItem("userNombre") || "";
    setNombre(savedNombre);
  }, []);

  function handleSave(e) {
    e.preventDefault();
    localStorage.setItem("userNombre", nombre);
    alert("Nombre guardado correctamente");
  }

  return (
    <form className="user-settings" onSubmit={handleSave}>
      <h2>Personalización de usuario</h2>
      <label>
        Nombre:
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" />
      </label>
      <label>
        Color de tema:
        <div className="color-options">
          {COLORS.map(opt => (
            <button
              key={opt.value}
              type="button"
              style={{ background: opt.value }}
              className={color === opt.value ? "color-option selected" : "color-option"}
              title={`Seleccionar color de tema: ${opt.name}`}
              onClick={() => setColor(opt.value)}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </label>
      <button type="submit">Guardar</button>
    </form>
  );
}
