import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./Dashboard.css";

export default function DashboardBajas() {
  const [estadisticas, setEstadisticas] = useState({
    bajasEsteMes: 0,
    bajasAnioActual: 0,
    promedioMensual: 0,
    tasaRetencion: 0,
    bajasPorMes: {},
  });
  const [openDropdown, setOpenDropdown] = useState("");

  useEffect(() => {
    // Leer datos reales de bajas desde localStorage
    try {
      const bajasPorDia = JSON.parse(localStorage.getItem("bajasPorDia") || "{}");
      let totalBajas = 0;
      let bajasEsteMes = 0;
      const fechaActual = new Date();
      const anioActual = fechaActual.getFullYear().toString();
      const mesActual = String(fechaActual.getMonth() + 1).padStart(2, "0");
      const bajasPorMes = {};

      // Contar todas las bajas
      Object.entries(bajasPorDia).forEach(([anio, meses]) => {
        Object.entries(meses).forEach(([mes, dias]) => {
          let mesTotal = 0;
          Object.values(dias).forEach(bajas => {
            mesTotal += bajas.length;
            totalBajas += bajas.length;
            // Contar bajas de este mes
            if (anio === anioActual && mes === mesActual) {
              bajasEsteMes += bajas.length;
            }
          });
          if (anio === anioActual) {
            bajasPorMes[mes] = (bajasPorMes[mes] || 0) + mesTotal;
          }
        });
      });

      // Contar bajas del año actual
      const bajasAnioActual = Object.values(bajasPorMes).reduce((a, b) => a + b, 0);

      // Calcular promedio mensual (basado en meses con datos)
      const mesesConDatos = Object.keys(bajasPorMes).length;
      const promedioMensual = mesesConDatos > 0 ? (bajasAnioActual / mesesConDatos).toFixed(1) : 0;

      // Calcular tasa de retención estimada (asumiendo base de clientes)
      // Esta es una estimación simplificada
      const tasaRetencion = totalBajas > 0 ? Math.max(0, (100 - (totalBajas / 100))).toFixed(1) : 95.0;

      setEstadisticas({
        bajasEsteMes,
        bajasAnioActual,
        promedioMensual: parseFloat(promedioMensual),
        tasaRetencion: parseFloat(tasaRetencion),
        bajasPorMes,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas de bajas:", error);
    }
  }, []);
  const meses = [
    "01","02","03","04","05","06","07","08","09","10","11","12"
  ];
  const mesesNombres = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  function renderDropdown() {
    let data = estadisticas.bajasPorMes;
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
      <h1>Reporte de Bajas</h1>
      <p>Análisis en tiempo real de las bajas registradas en el sistema</p>
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Bajas Este Mes
              <button className="dropdown-btn" onClick={() => setOpenDropdown(openDropdown === "mes" ? "" : "mes")} title="Ver detalle por mes" aria-label="Ver detalle por mes" style={{marginLeft:8, background:'none', border:'none', cursor:'pointer', verticalAlign:'middle'}}>
                <ChevronDown size={18} style={{verticalAlign:'middle'}} />
              </button>
            </h3>
            <p className="stat-number">{estadisticas.bajasEsteMes}</p>
            {openDropdown === "mes" && renderDropdown()}
          </div>
          <div className="stat-card">
            <h3>Bajas Año Actual
              <button className="dropdown-btn" onClick={() => setOpenDropdown(openDropdown === "anio" ? "" : "anio")} title="Ver detalle por mes" aria-label="Ver detalle por mes" style={{marginLeft:8, background:'none', border:'none', cursor:'pointer', verticalAlign:'middle'}}>
                <ChevronDown size={18} style={{verticalAlign:'middle'}} />
              </button>
            </h3>
            <p className="stat-number">{estadisticas.bajasAnioActual}</p>
            {openDropdown === "anio" && renderDropdown()}
          </div>
          <div className="stat-card">
            <h3>Promedio Mensual</h3>
            <p className="stat-number">{estadisticas.promedioMensual}</p>
          </div>
          <div className="stat-card">
            <h3>Tasa de Retención</h3>
            <p className="stat-number">{estadisticas.tasaRetencion}</p>
          </div>
        </div>
        {estadisticas.bajasAnioActual === 0 && (
          <div className="no-data-message">
            <p>No hay bajas registradas aún. Agrega bajas en la sección "Bajas" para ver las estadísticas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
