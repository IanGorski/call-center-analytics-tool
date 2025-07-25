import React from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          <button className="modal-btn confirm" onClick={onConfirm}>Sí, borrar</button>
          <button className="modal-btn cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
