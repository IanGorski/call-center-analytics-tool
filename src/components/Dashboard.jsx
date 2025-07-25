
import { useState, useEffect } from "react";
import "./Dashboard.css";

function BarChart({ data, labels, colors, height = 80, max = null, ariaLabel }) {
  const maxValue = max || Math.max(...data, 1);
  const barWidth = 28;
  const gap = 24;
  const totalWidth = data.length * barWidth + (data.length - 1) * gap;
  return (
    <svg
      width="100%"
      height={height + 22}
      viewBox={`0 0 ${totalWidth} ${height + 22}`}
      style={{marginTop:8, display:'block', marginLeft:'auto', marginRight:'auto'}} 
      role="img"
      aria-label={ariaLabel}
    >
      {data.map((val, i) => {
        const x = i * (barWidth + gap);
        const barHeight = (val / maxValue) * (height - 20);
        return (
          <g key={i}>
            <rect x={x} y={height - barHeight} width={barWidth} height={barHeight} rx={5} fill={colors[i] || '#3b82f6'} />
            <text x={x + barWidth / 2} y={height + 12} textAnchor="middle" fontSize="13" fill="#888">{labels[i]}</text>
            <text x={x + barWidth / 2} y={height - barHeight - 8} textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">{val}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PieChart({ values, colors, size = 80, ariaLabel }) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  const radius = size / 2 - 6;
  const cx = size / 2, cy = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{marginTop:8}}
      role="img"
      aria-label={ariaLabel}
    >
      {values.map((v, i) => {
        const start = acc / total * 2 * Math.PI;
        acc += v;
        const end = acc / total * 2 * Math.PI;
        const x1 = cx + radius * Math.sin(start);
        const y1 = cy - radius * Math.cos(start);
        const x2 = cx + radius * Math.sin(end);
        const y2 = cy - radius * Math.cos(end);
        const large = end - start > Math.PI ? 1 : 0;
        return (
          <path key={i} d={`M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${large} 1 ${x2},${y2} Z`} fill={colors[i]} />
        );
      })}
      {/* Etiquetas */}
      {values.map((v, i) => {
        const angle = ((values.slice(0, i).reduce((a, b) => a + b, 0) + v / 2) / total) * 2 * Math.PI;
        const x = cx + (radius / 1.5) * Math.sin(angle);
        const y = cy - (radius / 1.5) * Math.cos(angle);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="bold">
            {v > 0 ? v : ''}
          </text>
        );
      })}
    </svg>
  );
}

export default function Dashboard() {
  // Estados para datos y fechas
  const [casosPorDia, setCasosPorDia] = useState({});
  const [bajasPorDia, setBajasPorDia] = useState({});
  const [anio, setAnio] = useState("2025");
  const [mes, setMes] = useState("01");
  const [dia, setDia] = useState("01");

  // Función para cargar datos desde localStorage
  const loadData = () => {
    try {
      const casosData = JSON.parse(localStorage.getItem("casosPorDia")) || {};
      const bajasData = JSON.parse(localStorage.getItem("bajasPorDia")) || {};
      setCasosPorDia(casosData);
      setBajasPorDia(bajasData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Función para cargar fechas desde localStorage
  const loadDates = () => {
    const savedAnio = localStorage.getItem("selectedAnio") || "2025";
    const savedMes = localStorage.getItem("selectedMes") || "01";
    const savedDia = localStorage.getItem("selectedDia") || "01";
    setAnio(savedAnio);
    setMes(savedMes);
    setDia(savedDia);
  };

  // Efecto para cargar datos iniciales y configurar listener
  useEffect(() => {
    // Cargar datos iniciales
    loadData();
    loadDates();

    // Listener para cambios en localStorage
    const handleStorageChange = (e) => {
      if (e.key === "casosPorDia" || e.key === "bajasPorDia") {
        loadData();
      }
      if (e.key === "selectedAnio" || e.key === "selectedMes" || e.key === "selectedDia") {
        loadDates();
      }
    };

    // Listener personalizado para cambios internos de localStorage
    const handleCustomStorageChange = () => {
      loadData();
      loadDates();
    };

    // Agregar listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageUpdate", handleCustomStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdate", handleCustomStorageChange);
    };
  }, []);

  // Obtener datos del día y mes
  const casosDia = casosPorDia[anio]?.[mes]?.[dia] || [];
  const bajasDia = bajasPorDia[anio]?.[mes]?.[dia] || [];
  const casosMes = Object.values(casosPorDia[anio]?.[mes] || {}).flat();
  const bajasMes = Object.values(bajasPorDia[anio]?.[mes] || {}).flat();

  // Métricas del día
  const abiertos = casosDia.filter(c => c.estado === "Abierto").length;
  const cerrados = casosDia.filter(c => c.estado === "Cerrado").length;
  const retencionSi = casosDia.filter(c => c.retencion === "Sí").length;
  const retencionNo = casosDia.filter(c => c.retencion === "No").length;

  // Métricas del día - bajas
  const bajasPorMotivo = bajasDia.reduce((acc, b) => {
    acc[b.motivo] = (acc[b.motivo] || 0) + 1;
    return acc;
  }, {});
  const topMotivos = Object.entries(bajasPorMotivo).sort((a,b) => b[1]-a[1]).slice(0,3);

  // Métricas del mes - casos
  const abiertosMes = casosMes.filter(c => c.estado === "Abierto").length;
  const cerradosMes = casosMes.filter(c => c.estado === "Cerrado").length;
  const retencionSiMes = casosMes.filter(c => c.retencion === "Sí").length;
  const retencionNoMes = casosMes.filter(c => c.retencion === "No").length;

  // Métricas del mes - bajas
  const bajasPorMotivoMes = bajasMes.reduce((acc, b) => {
    acc[b.motivo] = (acc[b.motivo] || 0) + 1;
    return acc;
  }, {});
  const topMotivosMes = Object.entries(bajasPorMotivoMes).sort((a,b) => b[1]-a[1]).slice(0,3);

  const formatDate = (anio, mes, dia) => {
    const date = new Date(Number(anio), Number(mes) - 1, Number(dia));
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatMonth = (anio, mes) => {
    const date = new Date(Number(anio), Number(mes) - 1, 1);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  return (
    <div className="dashboard">
      {/* Dashboard del día */}
      <div className="dashboard-section">
        <h2>📊 Resumen del día - {formatDate(anio, mes, dia)}</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Casos del día</h3>
            <BarChart
              data={[abiertos, cerrados]}
              labels={["Abiertos", "Cerrados"]}
              colors={["#3b82f6", "#22c55e"]}
              height={80}
            />
            <div style={{
              display:'grid', 
              gridTemplateColumns:'1fr 1fr', 
              gap:'8px',
              marginTop:'12px',
              fontSize:'13px'
            }}>
              <div style={{color:'#3b82f6', textAlign:'center'}}>
                Abiertos<br/><b style={{fontSize:'16px'}}>{abiertos}</b>
              </div>
              <div style={{color:'#22c55e', textAlign:'center'}}>
                Cerrados<br/><b style={{fontSize:'16px'}}>{cerrados}</b>
              </div>
            </div>
            <div style={{marginTop:'16px', textAlign:'center', paddingTop:'12px', borderTop:'1px solid #2d3244'}}>
              <span style={{fontSize:'13px', color:'#888'}}>Total casos: </span>
              <b style={{fontSize:'16px', color:'#fff'}}>{casosDia.length}</b>
            </div>
            <div style={{
              marginTop:'16px', 
              display:'flex', 
              justifyContent:'space-between', 
              alignItems:'center',
              gap:'16px',
              paddingTop:'12px',
              borderTop:'1px solid #2d3244'
            }}>
              <div style={{textAlign:'center'}}>
                <div style={{marginBottom:'6px', fontSize:'12px', color:'#888'}}>Retención</div>
                <PieChart
                  values={[retencionSi, retencionNo]}
                  colors={["#f59e42", "#64748b"]}
                  size={60}
                  labels={["Sí", "No"]}
                />
              </div>
              <div style={{fontSize:'12px', lineHeight:'1.4'}}>
                <div style={{color:'#f59e42', marginBottom:'4px'}}>
                  Sí: <b style={{fontSize:'14px'}}>{retencionSi}</b>
                </div>
                <div style={{color:'#64748b'}}>
                  No: <b style={{fontSize:'14px'}}>{retencionNo}</b>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <h3>Bajas del día</h3>
            {topMotivos.length > 0 ? (
              <>
                <BarChart
                  data={topMotivos.map(m => m[1])}
                  labels={topMotivos.map(m => m[0].slice(0,8))}
                  colors={["#ef4444", "#f59e42", "#3b82f6"]}
                  height={80}
                />
                <div style={{marginTop:'12px'}}>
                  <div style={{fontSize:'12px', color:'#888', marginBottom:'6px'}}>Top motivos:</div>
                  {topMotivos.map(([motivo, cant], i) => (
                    <div key={motivo} style={{
                      color:['#ef4444', '#f59e42', '#3b82f6'][i], 
                      marginBottom:'3px',
                      fontSize:'13px'
                    }}>
                      {motivo}: <b style={{fontSize:'14px'}}>{cant}</b>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{textAlign:'center', color:'#888', padding:'20px'}}>
                No hay bajas registradas
              </div>
            )}
            <div style={{marginTop:'16px', textAlign:'center', paddingTop:'12px', borderTop:'1px solid #2d3244'}}>
              <span style={{fontSize:'13px', color:'#888'}}>Total bajas: </span>
              <b style={{fontSize:'16px', color:'#fff'}}>{bajasDia.length}</b>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard del mes */}
      <div className="dashboard-section">
        <h2>📈 Resumen mensual - {formatMonth(anio, mes)}</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Casos del mes</h3>
            <BarChart
              data={[abiertosMes, cerradosMes]}
              labels={["Abiertos", "Cerrados"]}
              colors={["#3b82f6", "#22c55e"]}
              height={80}
            />
            <div style={{
              display:'grid', 
              gridTemplateColumns:'1fr 1fr', 
              gap:'8px',
              marginTop:'12px',
              fontSize:'13px'
            }}>
              <div style={{color:'#3b82f6', textAlign:'center'}}>
                Abiertos<br/><b style={{fontSize:'16px'}}>{abiertosMes}</b>
              </div>
              <div style={{color:'#22c55e', textAlign:'center'}}>
                Cerrados<br/><b style={{fontSize:'16px'}}>{cerradosMes}</b>
              </div>
            </div>
            <div style={{marginTop:'16px', textAlign:'center', paddingTop:'12px', borderTop:'1px solid #2d3244'}}>
              <span style={{fontSize:'13px', color:'#888'}}>Total casos: </span>
              <b style={{fontSize:'16px', color:'#fff'}}>{casosMes.length}</b>
            </div>
            <div style={{
              marginTop:'16px', 
              display:'flex', 
              justifyContent:'space-between', 
              alignItems:'center',
              gap:'16px',
              paddingTop:'12px',
              borderTop:'1px solid #2d3244'
            }}>
              <div style={{textAlign:'center'}}>
                <div style={{marginBottom:'6px', fontSize:'12px', color:'#888'}}>Retención</div>
                <PieChart
                  values={[retencionSiMes, retencionNoMes]}
                  colors={["#f59e42", "#64748b"]}
                  size={60}
                  labels={["Sí", "No"]}
                />
              </div>
              <div style={{fontSize:'12px', lineHeight:'1.4'}}>
                <div style={{color:'#f59e42', marginBottom:'4px'}}>
                  Sí: <b style={{fontSize:'14px'}}>{retencionSiMes}</b>
                </div>
                <div style={{color:'#64748b'}}>
                  No: <b style={{fontSize:'14px'}}>{retencionNoMes}</b>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <h3>Bajas del mes</h3>
            {topMotivosMes.length > 0 ? (
              <>
                <BarChart
                  data={topMotivosMes.map(m => m[1])}
                  labels={topMotivosMes.map(m => m[0].slice(0,8))}
                  colors={["#ef4444", "#f59e42", "#3b82f6"]}
                  height={80}
                />
                <div style={{marginTop:'12px'}}>
                  <div style={{fontSize:'12px', color:'#888', marginBottom:'6px'}}>Top motivos:</div>
                  {topMotivosMes.map(([motivo, cant], i) => (
                    <div key={motivo} style={{
                      color:['#ef4444', '#f59e42', '#3b82f6'][i], 
                      marginBottom:'3px',
                      fontSize:'13px'
                    }}>
                      {motivo}: <b style={{fontSize:'14px'}}>{cant}</b>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{textAlign:'center', color:'#888', padding:'20px'}}>
                No hay bajas registradas
              </div>
            )}
            <div style={{marginTop:'16px', textAlign:'center', paddingTop:'12px', borderTop:'1px solid #2d3244'}}>
              <span style={{fontSize:'13px', color:'#888'}}>Total bajas: </span>
              <b style={{fontSize:'16px', color:'#fff'}}>{bajasMes.length}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
