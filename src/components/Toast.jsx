import React, { useEffect, useRef } from "react";
import "./Toast.css";

export default function Toast({ message, type = "success", onClose, visible = true }) {
  const toastRef = useRef(null);
  useEffect(() => {
    if (visible && toastRef.current) {
      toastRef.current.focus();
    }
  }, [visible, message]);
  if (!message || !visible) return null;
  return (
    <div
      className={`toast toast-${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      tabIndex={0}
      ref={toastRef}
      style={{ outline: "none" }}
    >
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Cerrar notificación">&times;</button>
    </div>
  );
}
