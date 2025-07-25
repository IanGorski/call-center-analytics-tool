import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./Dashboard.css";

export default function DashboardCasos() {
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    resueltos: 0,
    pendientes: 0,
    tasa: 0,
    porMes: {},
    resueltosPorMes: {},
    pendientesPorMes: {},
  });
  const [openDropdown, setOpenDropdown] = useState("");

  useEffect(() => {
    // Leer datos reales de casos desde localStorage
    try {
      const casosPorDia = JSON.parse(localStorage.getItem("casosPorDia") || "{}");
      let totalCasos = 0;
      let casosResueltos = 0;
      let casosPendientes = 0;
      const porMes = {};
      const resueltosPorMes = {};
      const pendientesPorMes = {};
      Object.values(casosPorDia).forEach(anio => {
        Object.entries(anio).forEach(([mes, dias]) => {
          let mesTotal = 0, mesResueltos = 0, mesPendientes = 0;
          Object.values(dias).forEach(casos => {
            mesTotal += casos.length;
            casos.forEach(caso => {
              if (caso.estado === "Cerrado") {
                mesResueltos++;
              } else {
                mesPendientes++;
              }
            });
          });
          porMes[mes] = (porMes[mes] || 0) + mesTotal;
          resueltosPorMes[mes] = (resueltosPorMes[mes] || 0) + mesResueltos;
          pendientesPorMes[mes] = (pendientesPorMes[mes] || 0) + mesPendientes;
          totalCasos += mesTotal;
          casosResueltos += mesResueltos;
          casosPendientes += mesPendientes;
        });
      });
      const tasaResolucion = totalCasos > 0 ? ((casosResueltos / totalCasos) * 100).toFixed(1) : 0;
      setEstadisticas({
        total: totalCasos,
        resueltos: casosResueltos,
        pendientes: casosPendientes,
        tasa: tasaResolucion,
        porMes,
        resueltosPorMes,
        pendientesPorMes,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas de casos:", error);
    }
  }, []);

  const meses = [
    "01","02","03","04","05","06","07","08","09","10","11","12"
  ];
  const mesesNombres = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  function renderDropdown(tipo) {
    let data = {};
    if (tipo === "total") data = estadisticas.porMes;
    if (tipo === "resueltos") data = estadisticas.resueltosPorMes;
    if (tipo === "pendientes") data = estadisticas.pendientesPorMes;
    return (
      <div className="dropdown-mes-list">
        {meses.map((m, i) => (
          <div key={m} className="dropdown-mes-item">
            <span>{mesesNombres[i]}</span>
            <b>{(data && data[m]) ? data[m] : 0}</b>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1>Análisis de Casos</h1>
      <p>Estadísticas en tiempo real de los casos del call center</p>
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Casos Totales
              <button className="dropdown-btn" onClick={() => setOpenDropdown(openDropdown === "total" ? "" : "total")} title="Ver detalle por mes" aria-label="Ver detalle por mes" style={{marginLeft:8, background:'none', border:'none', cursor:'pointer', verticalAlign:'middle'}}>
                <ChevronDown size={18} style={{verticalAlign:'middle'}} />
              </button>
            </h3>
            <p className="stat-number">{estadisticas.total.toLocaleString()}</p>
            {openDropdown === "total" && renderDropdown("total")}
          </div>
          <div className="stat-card">
            <h3>Casos Resueltos
              <button className="dropdown-btn" onClick={() => setOpenDropdown(openDropdown === "resueltos" ? "" : "resueltos")} title="Ver detalle por mes" aria-label="Ver detalle por mes" style={{marginLeft:8, background:'none', border:'none', cursor:'pointer', verticalAlign:'middle'}}>
                <ChevronDown size={18} style={{verticalAlign:'middle'}} />
              </button>
            </h3>
            <p className="stat-number">{estadisticas.resueltos.toLocaleString()}</p>
            {openDropdown === "resueltos" && renderDropdown("resueltos")}
          </div>
          <div className="stat-card">
            <h3>Casos Pendientes
              <button className="dropdown-btn" onClick={() => setOpenDropdown(openDropdown === "pendientes" ? "" : "pendientes")} title="Ver detalle por mes" aria-label="Ver detalle por mes" style={{marginLeft:8, background:'none', border:'none', cursor:'pointer', verticalAlign:'middle'}}>
                <ChevronDown size={18} style={{verticalAlign:'middle'}} />
              </button>
            </h3>
            <p className="stat-number">{estadisticas.pendientes.toLocaleString()}</p>
            {openDropdown === "pendientes" && renderDropdown("pendientes")}
          </div>
          <div className="stat-card">
            <h3>Tasa de Resolución</h3>
            <p className="stat-number">{estadisticas.tasa}%</p>
          </div>
        </div>
        {estadisticas.total === 0 && (
          <div className="no-data-message">
            <p>No hay casos registrados aún. Agrega casos en la sección "Casos" para ver las estadísticas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
