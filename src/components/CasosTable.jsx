import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import { Pencil, Trash2, Save, PlusCircle } from "lucide-react";
import { format, getDaysInMonth } from "date-fns";
import { es } from "date-fns/locale";
import "./CasosTable.css";

// Estructura: { [año]: { [mes]: { [día]: [casos...] } } }
const initialCasosPorDia = {};



export default function CasosTable({ showToast }) {
  // Estado: casos agrupados por año, mes y día
  const [casosPorDia, setCasosPorDia] = useState(() => {
    try {
      const data = localStorage.getItem("casosPorDia");
      return data ? JSON.parse(data) : initialCasosPorDia;
    } catch {
      return initialCasosPorDia;
    }
  });
  // Año, mes y día seleccionados - sincronizados con localStorage
  const [anio, setAnio] = useState(() => {
    return localStorage.getItem("selectedAnio") || "2025";
  });
  const [mes, setMes] = useState(() => {
    return localStorage.getItem("selectedMes") || "01";
  });
  const [dia, setDia] = useState(() => {
    return localStorage.getItem("selectedDia") || "01";
  });
  const [form, setForm] = useState({
    numero: "",
    tipo: "",
    estado: "Abierto",
    retencion: "No",
  });
  const [editIdx, setEditIdx] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);

  // Días válidos para el mes/año seleccionado
  const diasEnMes = getDaysInMonth(new Date(Number(anio), Number(mes) - 1));
  const diasArray = Array.from({ length: diasEnMes }, (_, i) => String(i + 1).padStart(2, "0"));

  // Filtros y búsqueda
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [retencionFiltro, setRetencionFiltro] = useState("");

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Casos del día seleccionado
  const casosRaw = casosPorDia[anio]?.[mes]?.[dia] || [];
  const casosFiltered = casosRaw.filter(caso => {
    const matchSearch =
      search === "" ||
      caso.numero?.toLowerCase().includes(search.toLowerCase()) ||
      caso.tipo?.toLowerCase().includes(search.toLowerCase());
    const matchEstado = estadoFiltro === "" || caso.estado === estadoFiltro;
    const matchRetencion = retencionFiltro === "" || caso.retencion === retencionFiltro;
    return matchSearch && matchEstado && matchRetencion;
  });

  // Lógica de paginación
  const totalItems = casosFiltered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const casos = casosFiltered.slice(startIndex, endIndex);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, estadoFiltro, retencionFiltro, anio, mes, dia]);

  function exportExcel() {
    const headers = ["Número", "Tipo", "Estado", "Retención"];
    const rows = casosFiltered.map(caso => [
      caso.numero || "",
      caso.tipo || "",
      caso.estado || "",
      caso.retencion || ""
    ]);
    
    // Crear CSV con punto y coma y comillas para Excel
    const csvContent = [
      headers.map(h => `"${h}"`).join(";"),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(";"))
    ].join("\r\n");
    
    // BOM UTF-8 para que Excel reconozca la codificación
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { 
      type: "text/csv;charset=utf-8;" 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `casos_${anio}_${mes}_${dia}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("casosPorDia", JSON.stringify(casosPorDia));
  }, [casosPorDia]);

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
    setForm({ numero: "", tipo: "", estado: "Abierto", retencion: "No" });
  }
  function handleMesChange(e) {
    const newMes = e.target.value;
    setMes(newMes);
    localStorage.setItem("selectedMes", newMes);
    setDia("01");
    localStorage.setItem("selectedDia", "01");
    setEditIdx(null);
    setForm({ numero: "", tipo: "", estado: "Abierto", retencion: "No" });
  }
  function handleDiaChange(e) {
    const newDia = e.target.value;
    setDia(newDia);
    localStorage.setItem("selectedDia", newDia);
    setEditIdx(null);
    setForm({ numero: "", tipo: "", estado: "Abierto", retencion: "No" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    let nuevosCasos = [...casosRaw];
    if (editIdx !== null) {
      nuevosCasos[editIdx] = form;
      showToast && showToast("Caso editado correctamente", "success");
    } else {
      nuevosCasos.push(form);
      showToast && showToast("Caso registrado correctamente", "success");
    }
    setCasosPorDia(prev => {
      const nuevo = { ...prev };
      if (!nuevo[anio]) nuevo[anio] = {};
      if (!nuevo[anio][mes]) nuevo[anio][mes] = {};
      nuevo[anio][mes][dia] = nuevosCasos;
      return nuevo;
    });
    setEditIdx(null);
    setForm({ numero: "", tipo: "", estado: "Abierto", retencion: "No" });
  }

  function handleEdit(idx) {
    setForm(casos[idx]);
    setEditIdx(idx);
  }

  function handleDelete(idx) {
    setDeleteIdx(idx);
    setModalOpen(true);
  }

  function confirmDelete() {
    const nuevosCasos = casos.filter((_, i) => i !== deleteIdx);
    setCasosPorDia(prev => {
      const nuevo = { ...prev };
      if (!nuevo[anio]) nuevo[anio] = {};
      if (!nuevo[anio][mes]) nuevo[anio][mes] = {};
      nuevo[anio][mes][dia] = nuevosCasos;
      return nuevo;
    });
    setEditIdx(null);
    setForm({ numero: "", tipo: "", estado: "Abierto", retencion: "No" });
    setModalOpen(false);
    setDeleteIdx(null);
    showToast && showToast("Caso eliminado", "success");
  }

  return (
    <div className="fade-in">
      <h3>Casos</h3>
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
      <div className="filters-and-export" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap'}}>
        <div className="filters" style={{display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap'}}>
          <input
            type="text"
            placeholder="Buscar por número o tipo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{minWidth:'250px', padding:'0.75rem 1rem', border:'2px solid var(--border)', borderRadius:'8px', fontSize:'0.9rem', background:'var(--background)', color:'var(--text)'}}
            autoComplete="off"
            aria-label="Buscar por número o tipo de caso"
            role="searchbox"
          />
          <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)} style={{padding:'0.75rem 1rem', border:'2px solid var(--border)', borderRadius:'8px', fontSize:'0.9rem', background:'var(--background)', color:'var(--text)', minWidth:'160px'}}>
            <option value="">Todos los estados</option>
            <option value="Abierto">Abierto</option>
            <option value="En proceso">En proceso</option>
            <option value="Cerrado">Cerrado</option>
          </select>
          <select value={retencionFiltro} onChange={e => setRetencionFiltro(e.target.value)} style={{padding:'0.75rem 1rem', border:'2px solid var(--border)', borderRadius:'8px', fontSize:'0.9rem', background:'var(--background)', color:'var(--text)', minWidth:'160px'}}>
            <option value="">Todas las retenciones</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
        <button type="button" onClick={exportExcel} style={{background:'var(--secondary)', color:'white', fontWeight:'600', padding:'0.75rem 1.5rem', borderRadius:'8px', boxShadow:'var(--shadow)', border:'none', cursor:'pointer', fontSize:'0.9rem', transition:'all 0.2s ease-in-out', whiteSpace:'nowrap'}}>
          Exportar CSV
        </button>
      </div>
      <form className="bajas-form" onSubmit={handleSubmit} style={{marginBottom:20}} role="form" aria-label="Formulario de casos">
        <label htmlFor="caso-numero">Número de caso
          <input id="caso-numero" name="numero" value={form.numero} onChange={handleChange} required autoComplete="off" aria-required="true" aria-label="Número de caso" />
        </label>
        <label htmlFor="caso-tipo">Tipo de caso
          <input id="caso-tipo" name="tipo" value={form.tipo} onChange={handleChange} required aria-required="true" aria-label="Tipo de caso" />
        </label>
        <label htmlFor="caso-estado">Estado
          <select id="caso-estado" name="estado" value={form.estado} onChange={handleChange} aria-label="Estado del caso">
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </label>
        <label htmlFor="caso-retencion">Retención
          <select id="caso-retencion" name="retencion" value={form.retencion} onChange={handleChange} aria-label="Retención">
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </label>
        <button
          type="submit"
          style={{background: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: 6}}
          title={editIdx !== null ? "Guardar cambios en el caso" : "Registrar nuevo caso"}
          aria-label={editIdx !== null ? "Guardar cambios en el caso" : "Registrar nuevo caso"}
        >
          {editIdx !== null ? <><Save size={18}/> Guardar cambios</> : <><PlusCircle size={18}/> Registrar caso</>}
        </button>
      </form>
      <h4 style={{marginTop:24}}>
        Casos del {format(new Date(Number(anio), Number(mes) - 1, Number(dia)), 'EEEE d', { locale: es })}
      </h4>
      <table className="casos-table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Retención</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {casos.map((caso, idx) => (
            <tr key={idx}>
              <td>{caso.numero}</td>
              <td>{caso.tipo}</td>
              <td>{caso.estado}</td>
              <td>{caso.retencion}</td>
              <td>
                <button
                  onClick={() => handleEdit(idx)}
                  style={{background: 'var(--secondary)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 4}}
                  title="Editar este caso"
                >
                  <Pencil size={16}/> Editar
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  style={{background: 'var(--danger)', color: '#fff', marginLeft:8, display: 'inline-flex', alignItems: 'center', gap: 4}}
                  title="Eliminar este caso"
                >
                  <Trash2 size={16}/> Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Controles de paginación */}
      {totalItems > 0 && (
        <nav
          aria-label="Paginación de tabla de casos"
          role="navigation"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'var(--card-bg)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
            <span id="label-items-per-page">Mostrar:</span>
            <select
              aria-label="Registros por página"
              aria-labelledby="label-items-per-page"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border)'}}
            >
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
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                aria-label="Ir a la primera página"
                tabIndex={0}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border)',
                  background: currentPage === 1 ? 'var(--disabled-bg)' : 'var(--card-bg)',
                  color: currentPage === 1 ? 'var(--disabled-text)' : 'var(--text)',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Primera
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                tabIndex={0}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border)',
                  background: currentPage === 1 ? 'var(--disabled-bg)' : 'var(--card-bg)',
                  color: currentPage === 1 ? 'var(--disabled-text)' : 'var(--text)',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Anterior
              </button>
            </li>
            <li style={{display: 'flex', alignItems: 'center'}} aria-live="polite" aria-atomic="true">
              <span
                style={{
                  padding: '0.5rem 0.75rem',
                  color: 'var(--text)',
                  fontWeight: '500'
                }}
                aria-label={`Página actual, ${currentPage} de ${totalPages}`}
              >
                {currentPage} de {totalPages}
              </span>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                tabIndex={0}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border)',
                  background: currentPage === totalPages ? 'var(--disabled-bg)' : 'var(--card-bg)',
                  color: currentPage === totalPages ? 'var(--disabled-text)' : 'var(--text)',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Siguiente
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Ir a la última página"
                tabIndex={0}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border)',
                  background: currentPage === totalPages ? 'var(--disabled-bg)' : 'var(--card-bg)',
                  color: currentPage === totalPages ? 'var(--disabled-text)' : 'var(--text)',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Última
              </button>
            </li>
          </ul>
        </nav>
      )}
      
      <ConfirmModal
        open={modalOpen}
        message="¿Seguro que deseas borrar este caso?"
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
