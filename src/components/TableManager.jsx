import React, { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import { Pencil, Trash2, Save, PlusCircle } from "lucide-react";
import "./CasosTable.css";

// columns: [{ key, label, type, options? }]
// type: 'text' | 'select'
export default function TableManager({
  storageKey,
  columns,
  defaultForm,
  showToast,
  filters = [],
  title = "",
}) {
  const [dataByDate, setDataByDate] = useState(() => {
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  });
  const [anio, setAnio] = useState(() => localStorage.getItem("selectedAnio") || "2025");
  const [mes, setMes] = useState(() => localStorage.getItem("selectedMes") || "01");
  const [dia, setDia] = useState(() => localStorage.getItem("selectedDia") || "01");
  const [form, setForm] = useState(defaultForm);
  const [editIdx, setEditIdx] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [search] = useState("");
  const [filterStates] = useState(
    filters.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {})
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Días válidos
  const diasEnMes = new Date(Number(anio), Number(mes), 0).getDate();
  const diasArray = Array.from({ length: diasEnMes }, (_, i) => String(i + 1).padStart(2, "0"));

  // Data del día seleccionado
  const dataRaw = dataByDate[anio]?.[mes]?.[dia] || [];
  const dataFiltered = dataRaw.filter(row => {
    let match = true;
    if (search) {
      match = columns.some(col =>
        String(row[col.key] || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    for (const f of filters) {
      if (filterStates[f.key] && row[f.key] !== filterStates[f.key]) return false;
    }
    return match;
  });
  const totalItems = dataFiltered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const data = dataFiltered.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStates, anio, mes, dia, itemsPerPage]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(dataByDate));
  }, [dataByDate, storageKey]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleAnioChange(e) {
    const newAnio = e.target.value;
    setAnio(newAnio);
    localStorage.setItem("selectedAnio", newAnio);
    setMes("01");
    localStorage.setItem("selectedMes", "01");
    setDia("01");
    localStorage.setItem("selectedDia", "01");
    setEditIdx(null);
    setForm(defaultForm);
  }
  function handleMesChange(e) {
    const newMes = e.target.value;
    setMes(newMes);
    localStorage.setItem("selectedMes", newMes);
    setDia("01");
    localStorage.setItem("selectedDia", "01");
    setEditIdx(null);
    setForm(defaultForm);
  }
  function handleDiaChange(e) {
    const newDia = e.target.value;
    setDia(newDia);
    localStorage.setItem("selectedDia", newDia);
    setEditIdx(null);
    setForm(defaultForm);
  }
  function handleSubmit(e) {
    e.preventDefault();
    let newData = [...dataRaw];
    if (editIdx !== null) {
      newData[editIdx] = form;
      showToast && showToast("Registro editado correctamente", "success");
    } else {
      newData.push(form);
      showToast && showToast("Registro agregado correctamente", "success");
    }
    setDataByDate(prev => {
      const nuevo = { ...prev };
      if (!nuevo[anio]) nuevo[anio] = {};
      if (!nuevo[anio][mes]) nuevo[anio][mes] = {};
      nuevo[anio][mes][dia] = newData;
      return nuevo;
    });
    setEditIdx(null);
    setForm(defaultForm);
  }
  function handleEdit(idx) {
    setForm(data[idx]);
    setEditIdx(idx);
  }
  function handleDelete(idx) {
    setDeleteIdx(idx);
    setModalOpen(true);
  }
  function confirmDelete() {
    const newData = data.filter((_, i) => i !== deleteIdx);
    setDataByDate(prev => {
      const nuevo = { ...prev };
      if (!nuevo[anio]) nuevo[anio] = {};
      if (!nuevo[anio][mes]) nuevo[anio][mes] = {};
      nuevo[anio][mes][dia] = newData;
      return nuevo;
    });
    setEditIdx(null);
    setForm(defaultForm);
    setModalOpen(false);
    setDeleteIdx(null);
    showToast && showToast("Registro eliminado", "success");
  }

  return (
    <div className="fade-in">
      <h3>{title}</h3>
      <div style={{marginBottom:16, display: 'flex', gap: 12}}>
        <label>Año:
          <select value={anio} onChange={handleAnioChange}>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </label>
        <label>Mes:
          <select value={mes} onChange={handleMesChange}>
            {[
              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ].map((nombre, i) => {
              const m = String(i + 1).padStart(2, "0");
              return <option key={m} value={m}>{nombre}</option>;
            })}
          </select>
        </label>
        <label>Día:
          <select value={dia} onChange={handleDiaChange}>
            {diasArray.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      <form className="bajas-form" onSubmit={handleSubmit} role="form" aria-label="Formulario">
        {columns.map(col => (
          <label key={col.key} htmlFor={col.key}>{col.label}
            {col.type === 'select' ? (
              <select id={col.key} name={col.key} value={form[col.key]} onChange={handleChange} required aria-required="true" aria-label={col.label}>
                {col.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input id={col.key} name={col.key} value={form[col.key]} onChange={handleChange} required aria-required="true" aria-label={col.label} />
            )}
          </label>
        ))}
        <button
          type="submit"
          style={{background: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: 6}}
          title={editIdx !== null ? "Guardar cambios" : "Registrar"}
          aria-label={editIdx !== null ? "Guardar cambios" : "Registrar"}
        >
          {editIdx !== null ? <><Save size={18}/> Guardar cambios</> : <><PlusCircle size={18}/> Registrar</>}
        </button>
      </form>
      {/* Tabla */}
      {totalItems > 0 && (
        <>
          <table className="casos-table" style={{marginTop: '2rem'}}>
            <thead>
              <tr>
                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => <td key={col.key}>{row[col.key]}</td>)}
                  <td>
                    <button onClick={() => handleEdit(idx)} style={{background: 'var(--secondary)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 4}} title="Editar">
                      <Pencil size={16}/> Editar
                    </button>
                    <button onClick={() => handleDelete(idx)} style={{background: 'var(--danger)', color: '#fff', marginLeft:8, display: 'inline-flex', alignItems: 'center', gap: 4}} title="Borrar">
                      <Trash2 size={16}/> Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginación */}
          <nav aria-label="Paginación" role="navigation" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '0.75rem', background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
              <span id="label-items-per-page">Mostrar:</span>
              <select aria-label="Registros por página" aria-labelledby="label-items-per-page" value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} style={{padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border)'}}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>registros por página</span>
            </div>
            <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
              Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} registros
            </div>
            <ul style={{display: 'flex', gap: '0.25rem', listStyle: 'none', margin: 0, padding: 0}} role="list" aria-label="Controles de paginación">
              <li>
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} aria-label="Ir a la primera página" tabIndex={0} style={{padding: '0.5rem 0.75rem', border: '1px solid var(--border)', background: currentPage === 1 ? 'var(--disabled-bg)' : 'var(--card-bg)', color: currentPage === 1 ? 'var(--disabled-text)' : 'var(--text)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}}>Primera</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Página anterior" tabIndex={0} style={{padding: '0.5rem 0.75rem', border: '1px solid var(--border)', background: currentPage === 1 ? 'var(--disabled-bg)' : 'var(--card-bg)', color: currentPage === 1 ? 'var(--disabled-text)' : 'var(--text)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}}>Anterior</button>
              </li>
              <li style={{display: 'flex', alignItems: 'center'}} aria-live="polite" aria-atomic="true">
                <span style={{padding: '0.5rem 0.75rem', color: 'var(--text)', fontWeight: '500'}} aria-label={`Página actual, ${currentPage} de ${totalPages}`}>{currentPage} de {totalPages}</span>
              </li>
              <li>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Página siguiente" tabIndex={0} style={{padding: '0.5rem 0.75rem', border: '1px solid var(--border)', background: currentPage === totalPages ? 'var(--disabled-bg)' : 'var(--card-bg)', color: currentPage === totalPages ? 'var(--disabled-text)' : 'var(--text)', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'}}>Siguiente</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} aria-label="Ir a la última página" tabIndex={0} style={{padding: '0.5rem 0.75rem', border: '1px solid var(--border)', background: currentPage === totalPages ? 'var(--disabled-bg)' : 'var(--card-bg)', color: currentPage === totalPages ? 'var(--disabled-text)' : 'var(--text)', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'}}>Última</button>
              </li>
            </ul>
          </nav>
          <ConfirmModal open={modalOpen} message="¿Seguro que deseas borrar este registro?" onConfirm={confirmDelete} onCancel={() => setModalOpen(false)} />
        </>
      )}
    </div>
  );
}
